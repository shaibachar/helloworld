package hello.repository.search;

import hello.domain.PhoneBook;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the PhoneBook entity.
 */
public interface PhoneBookSearchRepository extends ElasticsearchRepository<PhoneBook, Long> {
}
