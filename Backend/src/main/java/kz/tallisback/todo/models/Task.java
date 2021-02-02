package kz.tallisback.todo.models;


import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;

import javax.persistence.*;

@Entity
@Table
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "app_user_id")
    private AppUser appUser;

    private String todo;

    private Boolean completed = false;

    public Task() {
    }

    public Task(AppUser appUser, String todo, boolean b) {
        this.appUser = appUser;
        this.todo = todo;
        this.completed = b;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public void setAppUser(AppUser appUser) {
        this.appUser = appUser;
    }

    public AppUser getAppUser() {
        return appUser;
    }

    public void setTodo(String todo) {
        this.todo = todo;
    }

    public void setCompleted(Boolean completed) {
        this.completed = completed;
    }

    public String getTodo() {
        return todo;
    }

    public Boolean getCompleted() {
        return completed;
    }

    public void setId(int id) {
        this.id = id;
    }


    public Integer getId() {
        return id;
    }
}
