package com.shabloel.ecommerce.model;

import lombok.Data;

import javax.persistence.*;

/**
 * @author : christiaan.griffioen
 * @since :  13-5-2021, do
 **/

@Entity
@Table(name="states", schema="ecommerce")
@Data
public class State {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "state_id")
    private Long stateId;

    @Column(name = "state_name")
    private String stateName;

    @ManyToOne
    @JoinColumn(name="country_id")
    private Country country;
}
