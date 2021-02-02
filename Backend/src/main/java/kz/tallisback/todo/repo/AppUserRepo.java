package kz.tallisback.todo.repo;

import kz.tallisback.todo.models.AppUser;
import kz.tallisback.todo.models.Task;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AppUserRepo extends JpaRepository<AppUser, Integer> {
    AppUser findByUsername(String username);
}