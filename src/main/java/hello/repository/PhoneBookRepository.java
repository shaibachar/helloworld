package hello.repository;

import hello.domain.PhoneBook;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;


/**
 * Spring Data JPA repository for the PhoneBook entity.
 */
@SuppressWarnings("unused")
@Repository
public interface PhoneBookRepository extends JpaRepository<PhoneBook, Long> {

}
