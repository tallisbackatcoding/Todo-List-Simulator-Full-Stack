package kz.tallisback.todo.services;

import kz.tallisback.todo.models.AppUser;
import kz.tallisback.todo.models.Role;
import kz.tallisback.todo.repo.AppUserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Set;

@Service
public class AppUserService implements UserDetailsService {


    @Autowired
    private AppUserRepo appUserRepo;
    @Autowired
    BCryptPasswordEncoder bCryptPasswordEncoder;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        AppUser appUser = appUserRepo.findByUsername(username);
        if(appUser == null){
            throw new UsernameNotFoundException("Incorrect username or password");
        }else{
            return appUser;
        }
    }

    public AppUser loadById(Integer userId) throws UsernameNotFoundException {
        AppUser appUser = appUserRepo.findById(userId).orElse(null);
        if(appUser == null){
            throw new UsernameNotFoundException("Incorrect username or password");
        }else{
            return appUser;
        }
    }

    public boolean changeUsername(AppUser user, String newUsername){
        AppUser tempUser = null;
        AppUser sameUserWithPassword = appUserRepo.findByUsername(user.getUsername());
        try{
            tempUser = (AppUser)loadUserByUsername(newUsername);
            return false;
        }catch(UsernameNotFoundException e){
            sameUserWithPassword.setUsername(newUsername);
            appUserRepo.save(sameUserWithPassword);
        }
        return true;
    }

    public boolean changePassword(AppUser user, String newPassword, String oldPassword){
        AppUser sameUserWithPassword = appUserRepo.findByUsername(user.getUsername());
        if(BCrypt.checkpw(oldPassword, sameUserWithPassword.getPassword())){
            sameUserWithPassword.setPassword(bCryptPasswordEncoder.encode(newPassword));
            appUserRepo.save(sameUserWithPassword);
            return true;
        }
        return false;
    }

    public void updateUser(AppUser user) {
        appUserRepo.save(user);
    }

    public boolean createUser(AppUser user) {
        AppUser userFromDB = appUserRepo.findByUsername(user.getUsername());
        if (userFromDB != null) {
            return false;
        }
        List<Role> roles = new ArrayList<Role>();
        roles.add(new Role(1L, "ROLE_USER"));
        user.setRoles(roles);
        user.setPassword(bCryptPasswordEncoder.encode(user.getPassword()));
        appUserRepo.save(user);
        return true;
    }

    public List<AppUser> findAll(){
        return appUserRepo.findAll();
    }
}
