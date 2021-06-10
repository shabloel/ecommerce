package com.shabloel.ecommerce.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.util.List;

/**
 * @author : christiaan.griffioen
 * @since :  13-5-2021, do
 **/

@Entity
@Table(name="countries", schema="ecommerce")
@Getter
@Setter
public class Country {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "country_id")
    private Long countryId;

    @Column(name= "country_code")
    private String code;

    @Column(name = "country_name")
    private String countryName;

    @OneToMany(mappedBy = "country")
    @JsonIgnore
    private List<State> states;
}
