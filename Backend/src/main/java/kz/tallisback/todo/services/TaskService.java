package kz.tallisback.todo.services;

import kz.tallisback.todo.models.Task;
import kz.tallisback.todo.repo.AppUserRepo;
import kz.tallisback.todo.repo.TaskRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class TaskService {
    @Autowired
    TaskRepo taskRepo;
    @Autowired
    AppUserRepo appUserRepo;

    public void save(Task task){
        taskRepo.save(task);
    }

    public Task getById(int id){
        return taskRepo.findById(id).orElse(null);
    }

    public void deleteById(int id){
        taskRepo.deleteById(id);
    }
}
