package hello.service.job.item;

import hello.service.JobQueueService;
import org.springframework.batch.item.ItemReader;
import org.springframework.batch.item.NonTransientResourceException;
import org.springframework.batch.item.ParseException;
import org.springframework.batch.item.UnexpectedInputException;

public class Reader implements ItemReader<String> {

    private JobQueueService jobQueueService;

    public Reader(JobQueueService jobQueueService) {
        this.jobQueueService = jobQueueService;
    }

    private int count = 0;

    @Override
    public String read() throws Exception, UnexpectedInputException, ParseException, NonTransientResourceException {
        return jobQueueService.getMessage();
    }

}
