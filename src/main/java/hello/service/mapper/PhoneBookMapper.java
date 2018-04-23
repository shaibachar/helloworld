package hello.service.mapper;

import hello.domain.*;
import hello.service.dto.PhoneBookDTO;

import org.mapstruct.*;

/**
 * Mapper for the entity PhoneBook and its DTO PhoneBookDTO.
 */
@Mapper(componentModel = "spring", uses = {ClientMapper.class})
public interface PhoneBookMapper extends EntityMapper<PhoneBookDTO, PhoneBook> {

    @Mapping(source = "client.id", target = "clientId")
    @Mapping(source = "client.name", target = "clientName")
    PhoneBookDTO toDto(PhoneBook phoneBook);

    @Mapping(source = "clientId", target = "client")
    PhoneBook toEntity(PhoneBookDTO phoneBookDTO);

    default PhoneBook fromId(Long id) {
        if (id == null) {
            return null;
        }
        PhoneBook phoneBook = new PhoneBook();
        phoneBook.setId(id);
        return phoneBook;
    }
}
