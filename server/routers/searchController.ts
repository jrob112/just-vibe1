// const axios = require("axios");
import axios, { AxiosResponse } from 'axios';
import { Request, Response} from 'express';

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

require('dotenv').config();

const LAST_FM_API_KEY = process.env.LAST_FM_API_KEY;
const TICKETMASTER_API_KEY = process.env.TICKETMASTER_API_KEY;

module.exports = {
  handleSearch: (req: Request, res: Response) => {
    // retrieve search query from params
    const { search } = req.params;
    // create storage for search results
    // store results in an obj -> {artists: artist.search, albums: album.search}
    const searchResults = {artists: Object, albums: Object, events: Object};
    // pass search query
    // axios req to album search
    axios.get(`http://ws.audioscrobbler.com/2.0/?method=album.search&album=${search}&api_key=${LAST_FM_API_KEY}&format=json`)
      .then((data: AxiosResponse) => {

        searchResults.albums = data.data.results.albummatches;

        // axios req to artist search
        axios.get(`http://ws.audioscrobbler.com/2.0/?method=artist.search&artist=${search}&api_key=${LAST_FM_API_KEY}&format=json`)
        .then((data: AxiosResponse) => {

          searchResults.artists = data.data.results.artistmatches;
          // respond w {artists: artist.search, albums: album.search}
          axios.get(`https://app.ticketmaster.com/discovery/v2/events.json?apikey=${TICKETMASTER_API_KEY}&keyword=${search}`, {headers: {"Content-Type": "application/json"}})
          .then((data: any) => {
          
          searchResults.events = data.data._embedded.events[0]._embeded.venues;

          res.status(200).send(searchResults);
          })
          .catch((err: AxiosResponse) => console.error('err: ', err));
        })
        .catch((err: AxiosResponse) => console.error('err: ', err));
      })
      .catch((err: AxiosResponse) => console.error('err: ', err));
  }
};
