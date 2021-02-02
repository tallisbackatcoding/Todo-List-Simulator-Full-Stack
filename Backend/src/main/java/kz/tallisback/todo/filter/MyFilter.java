package kz.tallisback.todo.filter;

import kz.tallisback.todo.models.AppUser;
import kz.tallisback.todo.services.AppUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.servlet.*;
import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.net.http.HttpRequest;
import java.util.Date;

@Component
public class MyFilter implements Filter {

    @Autowired
    AppUserService appUserService;

    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {
        HttpServletRequest request = (HttpServletRequest) servletRequest;
        AppUser currentUser = (AppUser) request.getSession().getAttribute("appUser");
        if(currentUser != null){
            AppUser currentUserWithPassword = (AppUser) appUserService.loadUserByUsername(currentUser.getUsername());
            currentUserWithPassword.setLastAccessDate(new Date());
            currentUser.setLastAccessDate(new Date());
            appUserService.updateUser(currentUserWithPassword);
            request.getSession().setAttribute("appUser", currentUser);
        }
        filterChain.doFilter(servletRequest, servletResponse);
    }
}
