package hello.service;

import org.springframework.stereotype.Service;

import java.util.LinkedList;
import java.util.Queue;

@Service
public class JobQueueService {

    private Queue<String> messages;

    public JobQueueService() {
        messages = new LinkedList<>();
    }

    public boolean addMessage(String message) {
        if (message == null || message.isEmpty()) {
            return false;
        }

        boolean add = messages.add(message);
        return add;
    }

    public String getMessage(){
        return messages.poll();
    }
}
