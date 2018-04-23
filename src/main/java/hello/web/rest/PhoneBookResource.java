package hello.web.rest;

import com.codahale.metrics.annotation.Timed;
import hello.domain.PhoneBook;

import hello.repository.PhoneBookRepository;
import hello.web.rest.errors.BadRequestAlertException;
import hello.web.rest.util.HeaderUtil;
import hello.web.rest.util.PaginationUtil;
import hello.service.dto.PhoneBookDTO;
import hello.service.mapper.PhoneBookMapper;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;

import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing PhoneBook.
 */
@RestController
@RequestMapping("/api")
public class PhoneBookResource {

    private final Logger log = LoggerFactory.getLogger(PhoneBookResource.class);

    private static final String ENTITY_NAME = "phoneBook";

    private final PhoneBookRepository phoneBookRepository;

    private final PhoneBookMapper phoneBookMapper;

    public PhoneBookResource(PhoneBookRepository phoneBookRepository, PhoneBookMapper phoneBookMapper) {
        this.phoneBookRepository = phoneBookRepository;
        this.phoneBookMapper = phoneBookMapper;
    }

    /**
     * POST  /phone-books : Create a new phoneBook.
     *
     * @param phoneBookDTO the phoneBookDTO to create
     * @return the ResponseEntity with status 201 (Created) and with body the new phoneBookDTO, or with status 400 (Bad Request) if the phoneBook has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/phone-books")
    @Timed
    public ResponseEntity<PhoneBookDTO> createPhoneBook(@RequestBody PhoneBookDTO phoneBookDTO) throws URISyntaxException {
        log.debug("REST request to save PhoneBook : {}", phoneBookDTO);
        if (phoneBookDTO.getId() != null) {
            throw new BadRequestAlertException("A new phoneBook cannot already have an ID", ENTITY_NAME, "idexists");
        }
        PhoneBook phoneBook = phoneBookMapper.toEntity(phoneBookDTO);
        phoneBook = phoneBookRepository.save(phoneBook);
        PhoneBookDTO result = phoneBookMapper.toDto(phoneBook);
        return ResponseEntity.created(new URI("/api/phone-books/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /phone-books : Updates an existing phoneBook.
     *
     * @param phoneBookDTO the phoneBookDTO to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated phoneBookDTO,
     * or with status 400 (Bad Request) if the phoneBookDTO is not valid,
     * or with status 500 (Internal Server Error) if the phoneBookDTO couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/phone-books")
    @Timed
    public ResponseEntity<PhoneBookDTO> updatePhoneBook(@RequestBody PhoneBookDTO phoneBookDTO) throws URISyntaxException {
        log.debug("REST request to update PhoneBook : {}", phoneBookDTO);
        if (phoneBookDTO.getId() == null) {
            return createPhoneBook(phoneBookDTO);
        }
        PhoneBook phoneBook = phoneBookMapper.toEntity(phoneBookDTO);
        phoneBook = phoneBookRepository.save(phoneBook);
        PhoneBookDTO result = phoneBookMapper.toDto(phoneBook);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, phoneBookDTO.getId().toString()))
            .body(result);
    }

    /**
     * GET  /phone-books : get all the phoneBooks.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of phoneBooks in body
     */
    @GetMapping("/phone-books")
    @Timed
    public ResponseEntity<List<PhoneBookDTO>> getAllPhoneBooks(Pageable pageable) {
        log.debug("REST request to get a page of PhoneBooks");
        Page<PhoneBook> page = phoneBookRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/phone-books");
        return new ResponseEntity<>(phoneBookMapper.toDto(page.getContent()), headers, HttpStatus.OK);
    }

    /**
     * GET  /phone-books/:id : get the "id" phoneBook.
     *
     * @param id the id of the phoneBookDTO to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the phoneBookDTO, or with status 404 (Not Found)
     */
    @GetMapping("/phone-books/{id}")
    @Timed
    public ResponseEntity<PhoneBookDTO> getPhoneBook(@PathVariable Long id) {
        log.debug("REST request to get PhoneBook : {}", id);
        PhoneBook phoneBook = phoneBookRepository.findOne(id);
        PhoneBookDTO phoneBookDTO = phoneBookMapper.toDto(phoneBook);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(phoneBookDTO));
    }

    /**
     * DELETE  /phone-books/:id : delete the "id" phoneBook.
     *
     * @param id the id of the phoneBookDTO to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/phone-books/{id}")
    @Timed
    public ResponseEntity<Void> deletePhoneBook(@PathVariable Long id) {
        log.debug("REST request to delete PhoneBook : {}", id);
        phoneBookRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }
}
