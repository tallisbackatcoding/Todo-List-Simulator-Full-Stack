package kz.tallisback.todo.repo;

import kz.tallisback.todo.models.Role;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoleRepo extends JpaRepository<Role, Long> {

}
