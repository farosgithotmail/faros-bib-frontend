package com.faros.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import static org.springframework.web.bind.annotation.RequestMethod.GET;

/**
 * Created by juchtdi on 27/12/2016.
 */
@Controller
public class MainController {

    @RequestMapping(value = "/", method = GET)
    public String index(){
        return "index";
    }
}
