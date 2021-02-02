package kz.tallisback.todo.controllers;

import kz.tallisback.todo.models.AppUser;
import kz.tallisback.todo.models.Role;
import kz.tallisback.todo.repo.AppUserRepo;
import kz.tallisback.todo.services.AppUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpSession;
import java.util.*;

@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@RestController
@RequestMapping("/admin")
public class AdminController {
    @Autowired
    AppUserRepo appUserRepo;
    @Autowired
    AppUserService appUserService;
    @Autowired
    AuthenticationManager authenticationManager;

    @GetMapping("/users")
    public Object getUsersList(){
        Map<String, Object> responsePayload = new HashMap<>();
        responsePayload.put("users", appUserService.findAll());
        responsePayload.put("successCode", 0);
        return responsePayload;
    }

    @PatchMapping("/role/{userId}")
    public Object changeUserRole(@RequestBody Map<String, Object> requestPayload, @PathVariable Integer userId, HttpSession httpSession){
        AppUser appUser = (AppUser) httpSession.getAttribute("appUser");

        Role newRole = new Role();
        newRole.setName((String) requestPayload.get("newRole"));
        List<Role> newRoles = new ArrayList<>();
        newRoles.add(newRole);
        int successCode = 0;
        try{
            AppUser appUserToChange = appUserService.loadById(userId);
            if (appUserToChange.getRoles().get(0).getName().equals("ROLE_USER") &&
                    newRole.getName().equals("ROLE_MODE")){
                appUserToChange.setRoles(newRoles);
                appUserService.updateUser(appUserToChange);
            }else if(appUserToChange.getRoles().get(0).getName().equals("ROLE_MOD")
                    && newRole.getName().equals("ROLE_USER") && appUser.getRoles().get(0).getName().equals("ROLE_ADMIN")){
                appUserToChange.setRoles(newRoles);
                appUserService.updateUser(appUserToChange);
            }else{
                successCode = 1;
            }
        }catch (UsernameNotFoundException e){
            successCode = 1;
        }

        Map<String, Object> responsePayload = new HashMap<>();
        requestPayload.put("successCode", successCode);
        return responsePayload;
    }
}
