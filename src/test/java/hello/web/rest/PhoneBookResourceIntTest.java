package hello.web.rest;

import hello.HelloworldApp;

import hello.domain.PhoneBook;
import hello.repository.PhoneBookRepository;
import hello.service.dto.PhoneBookDTO;
import hello.service.mapper.PhoneBookMapper;
import hello.web.rest.errors.ExceptionTranslator;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import java.util.List;

import static hello.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Test class for the PhoneBookResource REST controller.
 *
 * @see PhoneBookResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = HelloworldApp.class)
public class PhoneBookResourceIntTest {

    private static final String DEFAULT_FIRST_NAME = "AAAAAAAAAA";
    private static final String UPDATED_FIRST_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_LAST_NAME = "AAAAAAAAAA";
    private static final String UPDATED_LAST_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_PHONE = "AAAAAAAAAA";
    private static final String UPDATED_PHONE = "BBBBBBBBBB";

    @Autowired
    private PhoneBookRepository phoneBookRepository;

    @Autowired
    private PhoneBookMapper phoneBookMapper;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restPhoneBookMockMvc;

    private PhoneBook phoneBook;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final PhoneBookResource phoneBookResource = new PhoneBookResource(phoneBookRepository, phoneBookMapper);
        this.restPhoneBookMockMvc = MockMvcBuilders.standaloneSetup(phoneBookResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter).build();
    }

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static PhoneBook createEntity(EntityManager em) {
        PhoneBook phoneBook = new PhoneBook()
            .firstName(DEFAULT_FIRST_NAME)
            .lastName(DEFAULT_LAST_NAME)
            .phone(DEFAULT_PHONE);
        return phoneBook;
    }

    @Before
    public void initTest() {
        phoneBook = createEntity(em);
    }

    @Test
    @Transactional
    public void createPhoneBook() throws Exception {
        int databaseSizeBeforeCreate = phoneBookRepository.findAll().size();

        // Create the PhoneBook
        PhoneBookDTO phoneBookDTO = phoneBookMapper.toDto(phoneBook);
        restPhoneBookMockMvc.perform(post("/api/phone-books")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(phoneBookDTO)))
            .andExpect(status().isCreated());

        // Validate the PhoneBook in the database
        List<PhoneBook> phoneBookList = phoneBookRepository.findAll();
        assertThat(phoneBookList).hasSize(databaseSizeBeforeCreate + 1);
        PhoneBook testPhoneBook = phoneBookList.get(phoneBookList.size() - 1);
        assertThat(testPhoneBook.getFirstName()).isEqualTo(DEFAULT_FIRST_NAME);
        assertThat(testPhoneBook.getLastName()).isEqualTo(DEFAULT_LAST_NAME);
        assertThat(testPhoneBook.getPhone()).isEqualTo(DEFAULT_PHONE);
    }

    @Test
    @Transactional
    public void createPhoneBookWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = phoneBookRepository.findAll().size();

        // Create the PhoneBook with an existing ID
        phoneBook.setId(1L);
        PhoneBookDTO phoneBookDTO = phoneBookMapper.toDto(phoneBook);

        // An entity with an existing ID cannot be created, so this API call must fail
        restPhoneBookMockMvc.perform(post("/api/phone-books")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(phoneBookDTO)))
            .andExpect(status().isBadRequest());

        // Validate the PhoneBook in the database
        List<PhoneBook> phoneBookList = phoneBookRepository.findAll();
        assertThat(phoneBookList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void getAllPhoneBooks() throws Exception {
        // Initialize the database
        phoneBookRepository.saveAndFlush(phoneBook);

        // Get all the phoneBookList
        restPhoneBookMockMvc.perform(get("/api/phone-books?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(phoneBook.getId().intValue())))
            .andExpect(jsonPath("$.[*].firstName").value(hasItem(DEFAULT_FIRST_NAME.toString())))
            .andExpect(jsonPath("$.[*].lastName").value(hasItem(DEFAULT_LAST_NAME.toString())))
            .andExpect(jsonPath("$.[*].phone").value(hasItem(DEFAULT_PHONE.toString())));
    }

    @Test
    @Transactional
    public void getPhoneBook() throws Exception {
        // Initialize the database
        phoneBookRepository.saveAndFlush(phoneBook);

        // Get the phoneBook
        restPhoneBookMockMvc.perform(get("/api/phone-books/{id}", phoneBook.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(phoneBook.getId().intValue()))
            .andExpect(jsonPath("$.firstName").value(DEFAULT_FIRST_NAME.toString()))
            .andExpect(jsonPath("$.lastName").value(DEFAULT_LAST_NAME.toString()))
            .andExpect(jsonPath("$.phone").value(DEFAULT_PHONE.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingPhoneBook() throws Exception {
        // Get the phoneBook
        restPhoneBookMockMvc.perform(get("/api/phone-books/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updatePhoneBook() throws Exception {
        // Initialize the database
        phoneBookRepository.saveAndFlush(phoneBook);
        int databaseSizeBeforeUpdate = phoneBookRepository.findAll().size();

        // Update the phoneBook
        PhoneBook updatedPhoneBook = phoneBookRepository.findOne(phoneBook.getId());
        // Disconnect from session so that the updates on updatedPhoneBook are not directly saved in db
        em.detach(updatedPhoneBook);
        updatedPhoneBook
            .firstName(UPDATED_FIRST_NAME)
            .lastName(UPDATED_LAST_NAME)
            .phone(UPDATED_PHONE);
        PhoneBookDTO phoneBookDTO = phoneBookMapper.toDto(updatedPhoneBook);

        restPhoneBookMockMvc.perform(put("/api/phone-books")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(phoneBookDTO)))
            .andExpect(status().isOk());

        // Validate the PhoneBook in the database
        List<PhoneBook> phoneBookList = phoneBookRepository.findAll();
        assertThat(phoneBookList).hasSize(databaseSizeBeforeUpdate);
        PhoneBook testPhoneBook = phoneBookList.get(phoneBookList.size() - 1);
        assertThat(testPhoneBook.getFirstName()).isEqualTo(UPDATED_FIRST_NAME);
        assertThat(testPhoneBook.getLastName()).isEqualTo(UPDATED_LAST_NAME);
        assertThat(testPhoneBook.getPhone()).isEqualTo(UPDATED_PHONE);
    }

    @Test
    @Transactional
    public void updateNonExistingPhoneBook() throws Exception {
        int databaseSizeBeforeUpdate = phoneBookRepository.findAll().size();

        // Create the PhoneBook
        PhoneBookDTO phoneBookDTO = phoneBookMapper.toDto(phoneBook);

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restPhoneBookMockMvc.perform(put("/api/phone-books")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(phoneBookDTO)))
            .andExpect(status().isCreated());

        // Validate the PhoneBook in the database
        List<PhoneBook> phoneBookList = phoneBookRepository.findAll();
        assertThat(phoneBookList).hasSize(databaseSizeBeforeUpdate + 1);
    }

    @Test
    @Transactional
    public void deletePhoneBook() throws Exception {
        // Initialize the database
        phoneBookRepository.saveAndFlush(phoneBook);
        int databaseSizeBeforeDelete = phoneBookRepository.findAll().size();

        // Get the phoneBook
        restPhoneBookMockMvc.perform(delete("/api/phone-books/{id}", phoneBook.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<PhoneBook> phoneBookList = phoneBookRepository.findAll();
        assertThat(phoneBookList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(PhoneBook.class);
        PhoneBook phoneBook1 = new PhoneBook();
        phoneBook1.setId(1L);
        PhoneBook phoneBook2 = new PhoneBook();
        phoneBook2.setId(phoneBook1.getId());
        assertThat(phoneBook1).isEqualTo(phoneBook2);
        phoneBook2.setId(2L);
        assertThat(phoneBook1).isNotEqualTo(phoneBook2);
        phoneBook1.setId(null);
        assertThat(phoneBook1).isNotEqualTo(phoneBook2);
    }

    @Test
    @Transactional
    public void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(PhoneBookDTO.class);
        PhoneBookDTO phoneBookDTO1 = new PhoneBookDTO();
        phoneBookDTO1.setId(1L);
        PhoneBookDTO phoneBookDTO2 = new PhoneBookDTO();
        assertThat(phoneBookDTO1).isNotEqualTo(phoneBookDTO2);
        phoneBookDTO2.setId(phoneBookDTO1.getId());
        assertThat(phoneBookDTO1).isEqualTo(phoneBookDTO2);
        phoneBookDTO2.setId(2L);
        assertThat(phoneBookDTO1).isNotEqualTo(phoneBookDTO2);
        phoneBookDTO1.setId(null);
        assertThat(phoneBookDTO1).isNotEqualTo(phoneBookDTO2);
    }

    @Test
    @Transactional
    public void testEntityFromId() {
        assertThat(phoneBookMapper.fromId(42L).getId()).isEqualTo(42);
        assertThat(phoneBookMapper.fromId(null)).isNull();
    }
}
