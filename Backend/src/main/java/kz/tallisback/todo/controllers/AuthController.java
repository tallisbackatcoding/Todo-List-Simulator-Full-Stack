package kz.tallisback.todo.controllers;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.Bucket4j;
import io.github.bucket4j.Refill;
import kz.tallisback.todo.models.AppUser;
import kz.tallisback.todo.repo.AppUserRepo;
import kz.tallisback.todo.services.AppUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpSession;
import java.time.Duration;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@RestController
@RequestMapping("/auth")
public class AuthController {
    @Autowired
    AppUserRepo appUserRepo;
    @Autowired
    AppUserService appUserService;
    @Autowired
    AuthenticationManager authenticationManager;

    private final Bucket bucket;

    public AuthController(){
        Bandwidth limit = Bandwidth.classic(40, Refill.greedy(10, Duration.ofMinutes(1)));
        this.bucket = Bucket4j.builder()
                .addLimit(limit)
                .build();
    }

    @CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
    @PostMapping("/login")
    public Object login(@RequestBody AppUser credentials, HttpSession httpSession){

        if(!bucket.tryConsume(5)){
            return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS).build();
        }

        Authentication authentication = new UsernamePasswordAuthenticationToken(credentials.getUsername(), credentials.getPassword());
        AppUser appUser = null;
        Map<String, Object> response = new HashMap<>();

        int successCode = 0;
        try{
            appUser = (AppUser)appUserService.loadUserByUsername(credentials.getUsername());
        }catch(UsernameNotFoundException ex){
            successCode = 1;
        }

        if (successCode == 0 && !BCrypt.checkpw(credentials.getPassword(), appUser.getPassword())){
            successCode = 1;
            appUser = null;
        }else if(successCode == 0){
            SecurityContextHolder.getContext().setAuthentication(authenticationManager.authenticate(authentication));
            appUser = (AppUser) appUserService.loadUserByUsername(appUser.getUsername());
            appUser.setPassword(null);
        }
        httpSession.removeAttribute("appUser");
        httpSession.setAttribute("appUser", appUser);
        response.put("successCode", successCode);
        response.put("user", appUser);

        return response;
    }

    @CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
    @PostMapping("/register")
    public Object registerNewUser(@RequestBody Map<String, String> payload){

        if(!bucket.tryConsume(5)){
            return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS).build();
        }

        AppUser appUser = new AppUser();
        appUser.setUsername(payload.get("username"));
        appUser.setPassword(payload.get("password"));
        appUser.setRegistrationDate(new Date());
        int successCode = 0;
        try {
            appUserService.loadUserByUsername(appUser.getUsername());
            successCode = 1;
        }catch (UsernameNotFoundException ex){
            appUserService.createUser(appUser);
        }
        Map<String, Object> response = new HashMap<>();
        response.put("successCode", successCode);

        return response;
    }

    @DeleteMapping("/logout")
    public Object logout(HttpSession session) {

        if(!bucket.tryConsume(5)){
            return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS).build();
        }

        int successCode = 0;
        session.removeAttribute("appUser");
        try{
            session.invalidate();

        }catch(Exception e){
            successCode = 1;
        }
        Map<String, Object> response = new HashMap<>();
        response.put("successCode", successCode);
        return response;
    }

    @GetMapping("/me")
    public Object me(HttpSession httpSession){

        Map<String, Object> response = new HashMap<>();
        AppUser appUser = (AppUser) httpSession.getAttribute("appUser");
        if(appUser == null){
            response.put("successCode", 1);
        }else{
            appUser.setPassword(null);
            response.put("successCode", 0);
        }
        response.put("user", appUser);
        return response;
    }

    @PatchMapping("/password")
    public Object changePassword(@RequestBody Map<String, String> payload, HttpSession httpSession){

        if(!bucket.tryConsume(5)){
            return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS).build();
        }

        Map<String, Object> response = new HashMap<>();
        AppUser appUser = (AppUser) httpSession.getAttribute("appUser");

        if(appUserService.changePassword(appUser, payload.get("newPassword"), payload.get("oldPassword"))) {
            response.put("successCode", 0);
        }
        else{
            response.put("successCode", 1);
        }

        response.put("user", appUser);
        return response;
    }

    @PatchMapping("/username")
    public Object changeUsername(@RequestBody Map<String, String> payload, HttpSession httpSession){

        if(!bucket.tryConsume(5)){
            return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS).build();
        }

        Map<String, Object> response = new HashMap<>();
        AppUser appUser = (AppUser) httpSession.getAttribute("appUser");
        int successCode = 0;
        try{
            if(!appUserService.changeUsername(appUser, payload.get("newUsername"))){
                successCode = 1;
            }
            response.put("successCode", successCode);
            appUser.setUsername(payload.get("newUsername"));
            httpSession.setAttribute("appUser", appUser);
            
        }catch(Exception e){
            System.out.println(Arrays.toString(e.getStackTrace()));
            response.put("successCode", 1);
        }
        response.put("user", appUser);
        return response;
    }
}
