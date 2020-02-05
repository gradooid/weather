import React from 'react';
import axios from 'axios';
import {
  TextField,
  CircularProgress,
  Grid,
  Chip,
  Container,
  Card,
  CardContent
} from '@material-ui/core';

export default class App extends React.Component {
  constructor() {
    super();

    this.state = {
      apiKey: 'fc932c67434613e809c47f3c64d28601',
      city: 'Lviv',
      forecast: [],
      curForecast: {},
      dailyForecast: [],
      hourlyForecast: [],
      loading: true,
      error: null
    };
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
      .catch(err => this.setState({ error: err.data, loading: false }));
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
    this.getForecast();
  }

  render() {
    const day = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
      <Container>
        <form onSubmit={e => this.getForecast(e)}>
          <TextField
            error={this.state.error !== null}
            helperText={this.state.error !== null && 'City not found'}
            variant="outlined"
            placeholder="Search for your city"
            onChange={e => this.setState({ city: e.target.value })}
            value={this.state.city}
          />
        </form>
        {!this.state.loading && this.state.error === null && (
          <div>
            <Grid container>
              <Grid item>
                <h1>{Math.round(this.state.curForecast.main.temp)} ℃</h1>
                <div>
                  <p>Cloudiness: {this.state.curForecast.clouds.all}%</p>
                  <p>Humidity: {this.state.curForecast.main.humidity}%</p>
                  <p>
                    Wind speed:{' '}
                    {Math.round(this.state.curForecast.wind.speed) * 3.6}km/h
                  </p>
                </div>
              </Grid>
            </Grid>
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
            <Grid container>
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
                    cursor: 'pointer'
                  }}
                  // color={
                  //   new Date(this.state.curForecast.dt * 1000).getDate() ===
                  //   new Date(elem.dt * 1000).getDate()
                  //     ? 'primary'
                  //     : 'default'
                  // }
                  onClick={() =>
                    this.showCurWeather(new Date(elem.dt * 1000).getDate())
                  }
                >
                  <CardContent>
                    <p>{day[new Date(elem.dt * 1000).getDay()]}</p>
                    <p>
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
