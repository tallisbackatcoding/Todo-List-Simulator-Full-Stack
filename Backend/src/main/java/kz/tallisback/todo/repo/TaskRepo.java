package kz.tallisback.todo.repo;

import kz.tallisback.todo.models.Task;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TaskRepo extends JpaRepository<Task, Integer> {

}
