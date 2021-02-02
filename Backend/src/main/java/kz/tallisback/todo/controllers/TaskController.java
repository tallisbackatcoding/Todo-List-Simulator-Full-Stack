package kz.tallisback.todo.controllers;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.Bucket4j;
import io.github.bucket4j.Refill;
import kz.tallisback.todo.models.AppUser;
import kz.tallisback.todo.models.Task;
import kz.tallisback.todo.services.AppUserService;
import kz.tallisback.todo.services.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpSession;
import javax.websocket.server.PathParam;
import java.time.Duration;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Stream;

@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@RestController
@RequestMapping("/task")
public class TaskController {

    private final Bucket bucket;

    public TaskController() {
        Bandwidth limit = Bandwidth.classic(40, Refill.greedy(10, Duration.ofMinutes(1)));
        this.bucket = Bucket4j.builder()
                .addLimit(limit)
                .build();
    }

    @Autowired
    TaskService taskService;
    @Autowired
    AppUserService appUserService;

    @GetMapping("/list")
    public Object getList(HttpSession httpSession){
        if(!bucket.tryConsume(2)){
            return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS).build();
        }
        AppUser appUser = (AppUser) httpSession.getAttribute("appUser");
        Stream<Task> completedTasks = appUser.getTasks().stream().filter(task-> task.getCompleted());
        Stream<Task> uncompletedTasks = appUser.getTasks().stream().filter(task-> !task.getCompleted());
        Map<String, Object> response = new HashMap<>();
        response.put("completedTasks", completedTasks);
        response.put("uncompletedTasks", uncompletedTasks);
        response.put("successCode", 0);
        return response;
    }

    @PostMapping("/add")
    public Object addTask(@RequestBody Task requestTask, HttpSession httpSession){
        if(!bucket.tryConsume(1)){
            return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS).build();
        }

        AppUser appUser = (AppUser) httpSession.getAttribute("appUser");
        Map<String, Object> response = new HashMap<>();

        Task task = new Task(appUser, requestTask.getTodo(), requestTask.getCompleted());
        taskService.save(task);

        httpSession.removeAttribute("appUser");
        AppUser tempUser = ((AppUser) appUserService.loadUserByUsername(appUser.getUsername()));
        httpSession.setAttribute("appUser", tempUser);

        response.put("successCode", 0);
        response.put("task", task);
        return response;
    }

    @CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
    @PutMapping("/update/{taskId}")
    public Object updateTask(@RequestBody Task requestTask, @PathVariable Integer taskId, HttpSession httpSession){
        if(!bucket.tryConsume(1)){
            return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS).build();
        }

        AppUser appUser = (AppUser) httpSession.getAttribute("appUser");
        Map<String, Object> response = new HashMap<>();

        Task task = taskService.getById(taskId);

        if (task == null){
            response.put("successCode", 1);
            return response;
        }

        task.setTodo(requestTask.getTodo());
        task.setCompleted(requestTask.getCompleted());

        if (task.getAppUser().getId().equals(appUser.getId())){
            taskService.save(task);
            AppUser tempUser = ((AppUser) appUserService.loadUserByUsername(appUser.getUsername()));
            httpSession.setAttribute("appUser", tempUser);
        }else{
            response.put("successCode", 1);
            return response;
        }
        response.put("successCode", 0);
        response.put("task", task);
        return response;
    }

    @CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true", allowedHeaders = "*")
    @DeleteMapping("/delete/{id}")
    public Object deleteTask(@PathVariable Integer id, HttpSession httpSession){
        if(!bucket.tryConsume(1)){
            return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS).build();
        }

        AppUser appUser = (AppUser) httpSession.getAttribute("appUser");
        Map<String, Object> response = new HashMap<>();
        try{
            taskService.deleteById(id);
            response.put("successCode", 0);
            httpSession.removeAttribute("appUser");
            AppUser tempUser = ((AppUser) appUserService.loadUserByUsername(appUser.getUsername()));
            httpSession.setAttribute("appUser", tempUser);
        }catch(Exception e){
            response.put("successCode", 1);
        }
        return response;
    }
}
