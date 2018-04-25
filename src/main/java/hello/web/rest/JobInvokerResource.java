package hello.web.rest;

import com.codahale.metrics.annotation.Timed;
import hello.service.JobQueueService;
import org.springframework.batch.core.Job;
import org.springframework.batch.core.JobParameters;
import org.springframework.batch.core.JobParametersBuilder;
import org.springframework.batch.core.launch.JobLauncher;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@RestController
@RequestMapping("/api")
public class JobInvokerResource {

    private final JobLauncher jobLauncher;
    private final Job processJob;
    private final JobQueueService jobQueueService;

    public JobInvokerResource(JobLauncher jobLauncher, Job processJob, JobQueueService jobQueueService) {
        this.jobLauncher = jobLauncher;
        this.processJob = processJob;
        this.jobQueueService = jobQueueService;

    }

    @PostMapping("/addMessageJob")
    @Timed
    public String addMessageJob(@Valid @RequestBody String message) {
        jobQueueService.addMessage(message);
        return message + " : sent";
    }

    @PutMapping("/invokejob")
    public String handle() throws Exception {
        JobParameters jobParameters = new JobParametersBuilder().addLong("time", System.currentTimeMillis())
            .toJobParameters();
        jobLauncher.run(processJob, jobParameters);

        return "Batch job has been invoked";
    }
}
