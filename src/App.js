import React from 'react';
import axios from 'axios';
import {
  TextField,
  CircularProgress,
  Grid,
  Chip,
  Container,
  Card,
  CardContent,
  InputAdornment,
  IconButton
} from '@material-ui/core';
import { Check, ErrorOutline } from '@material-ui/icons';
import { green } from '@material-ui/core/colors';

import cityList from './city.list.json';

export default class App extends React.Component {
  constructor() {
    super();

    this.state = {
      apiKey: 'fc932c67434613e809c47f3c64d28601',
      city: '',
      forecast: [],
      curForecast: {},
      dailyForecast: [],
      hourlyForecast: [],
      lat: '',
      lon: '',
      loading: true,
      error: null
    };
  }

  getInitialForecast(e) {
    this.setState({ loading: true });
    e && e.preventDefault();

    axios
      .get(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${this.state.lat}&lon=${this.state.lon}&units=metric&appid=${this.state.apiKey}`
      )
      .then(res => {
        let dailyForecast = [];

        res.data.list.forEach((elem, index) => {
          if (
            index < res.data.list.length - 1 &&
            new Date(elem.dt * 1000).getDate() !==
              new Date(res.data.list[index + 1].dt * 1000).getDate()
          ) {
            dailyForecast.push(elem);
          }
        });

        this.setState({
          forecast: res.data.list,
          dailyForecast: dailyForecast,
          error: null
        });

        // Get data for today's forecast
        this.showCurWeather(new Date().getDate());
        this.showHourlyForecast(new Date().getDate());
      })
      .catch(err =>
        this.setState({
          error: err.response.data,
          loading: false
        })
      );
  }

  getForecast(e) {
    this.setState({ loading: true });
    e && e.preventDefault();

    axios
      .get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${this.state.city}&units=metric&appid=${this.state.apiKey}`
      )
      .then(res => {
        let dailyForecast = [];

        res.data.list.forEach((elem, index) => {
          if (
            index < res.data.list.length - 1 &&
            new Date(elem.dt * 1000).getDate() !==
              new Date(res.data.list[index + 1].dt * 1000).getDate()
          ) {
            dailyForecast.push(elem);
          }
        });

        this.setState({
          forecast: res.data.list,
          dailyForecast: dailyForecast,
          error: null
        });

        // Get data for today's forecast
        this.showCurWeather(new Date().getDate());
        this.showHourlyForecast(new Date().getDate());
      })
      .catch(err =>
        this.setState({
          error: err.response.data,
          loading: false
        })
      );
  }

  showCurWeather(date) {
    let curForecast;

    // Get forecast for selected date
    for (let i = 0; i < this.state.forecast.length; i++) {
      if (new Date(this.state.forecast[i].dt * 1000).getDate() === date) {
        curForecast = this.state.forecast[i];

        break;
      }
    }

    this.setState({ curForecast: curForecast, error: null });
    this.showHourlyForecast(date);
  }

  showHourlyForecast(date) {
    let hourlyForecast = [];

    this.state.forecast.forEach(elem => {
      if (new Date(elem.dt * 1000).getDate() === date) {
        hourlyForecast.push(elem);
      }
    });

    this.setState({
      hourlyForecast: hourlyForecast,
      loading: false,
      error: null
    });
  }

  componentDidMount() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(({ coords }) => {
        const curCity = cityList
          .filter(
            city =>
              Math.round(city.coord.lat) === Math.round(coords.latitude) &&
              Math.round(city.coord.lon) === Math.round(coords.longitude)
          )
          .sort((a, b) => {
            const lat_a = Math.abs(a.coord.lat - coords.latitude);
            const lon_a = Math.abs(a.coord.lon - coords.longitude);
            const lat_b = Math.abs(b.coord.lat - coords.latitude);
            const lon_b = Math.abs(b.coord.lon - coords.longitude);
            return lat_a + lon_a - (lat_b + lon_b);
          });
        this.setState({
          city: curCity[0].name
        });
        this.getForecast();
      });
    } else {
      this.getForecast();
    }
  }

  render() {
    const day = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
      <Container
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <form onSubmit={e => this.getForecast(e)}>
          <TextField
            error={this.state.error !== null}
            helperText={
              this.state.error !== null &&
              this.state.error.message.slice(0, 1).toUpperCase() +
                this.state.error.message.slice(1)
            }
            variant="outlined"
            placeholder="Search for your city"
            onChange={e => this.setState({ city: e.target.value })}
            value={this.state.city}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={e => this.showForecast(e)}>
                    {!this.state.error && !this.state.loading && (
                      <Check style={{ color: green[500] }} />
                    )}
                    {this.state.error && !this.state.loading && (
                      <ErrorOutline color="error" />
                    )}
                    {this.state.loading && <CircularProgress size="1em" />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
        </form>
        <br />

        {!this.state.loading && this.state.error === null && (
          <div>
            <Grid container>
              <Grid item>
                <h1>{Math.round(this.state.curForecast.main.temp)} °C</h1>
                <div>
                  <p>Cloudiness: {this.state.curForecast.clouds.all}%</p>
                  <p>Humidity: {this.state.curForecast.main.humidity}%</p>
                  <p>
                    Wind speed:{' '}
                    {Math.round(this.state.curForecast.wind.speed) * 3.6}
                    km/h
                  </p>
                </div>
              </Grid>
            </Grid>
            <br />
            <Grid container justify="flex-start">
              {this.state.hourlyForecast.map((elem, index) => (
                <Grid item key={index}>
                  <p className="temp-secondary">{Math.round(elem.main.temp)}</p>
                  <Chip
                    color={
                      new Date(elem.dt * 1000).getHours() ===
                      new Date(this.state.curForecast.dt * 1000).getHours()
                        ? 'primary'
                        : 'default'
                    }
                    onClick={() => this.setState({ curForecast: elem })}
                    label={`${
                      new Date(elem.dt * 1000).getHours() < 10
                        ? '0' + new Date(elem.dt * 1000).getHours()
                        : new Date(elem.dt * 1000).getHours()
                    }:${
                      new Date(elem.dt * 1000).getMinutes() < 10
                        ? '0' + new Date(elem.dt * 1000).getMinutes()
                        : new Date(elem.dt * 1000).getMinutes()
                    }`}
                  />
                </Grid>
              ))}
            </Grid>
            <br />
            <Grid container wrap="nowrap">
              {this.state.dailyForecast.map((elem, index) => (
                <Card
                  key={index}
                  variant="outlined"
                  style={{
                    borderColor:
                      new Date(elem.dt * 1000).getDate() ===
                      new Date(this.state.curForecast.dt * 1000).getDate()
                        ? '#1976d2'
                        : 'rgba(0, 0, 0, 0.12)',
                    cursor: 'pointer',
                    display: 'flex',
                    flexBasis: 'content'
                  }}
                  onClick={() =>
                    this.showCurWeather(new Date(elem.dt * 1000).getDate())
                  }
                >
                  <CardContent>
                    <p>{day[new Date(elem.dt * 1000).getDay()]}</p>
                    <p
                      style={{
                        display: 'flex',
                        justifyContent: 'start',
                        flexWrap: 'nowrap'
                      }}
                    >
                      <span>{Math.round(elem.main.temp_max)}° </span>
                      <span style={{ color: '#777' }}>
                        {Math.round(elem.main.temp_min)}°
                      </span>
                    </p>
                  </CardContent>
                </Card>
              ))}
            </Grid>
          </div>
        )}
      </Container>
    );
  }
}
