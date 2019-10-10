import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import '../node_modules/font-awesome/css/font-awesome.min.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './ajaxservice';

const api_key = "1c4084dde4ea7820d6787ebf2c0846e5";

class MovieTown extends React.Component {
    render() {
        return (
            <div>
                <MovieView />
            </div>
        );
    }
}

class MovieView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            searchValue: '',
            isWatchList: false,
            isLoaded: false,
            items: [],
            watchList: [],
            config: [],
        }
    }

    render() {
        return (
            <div>
                <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                    <a className="navbar-brand" href="/" >MovieTown</a>
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav mr-auto">
                            <li className="nav-item active">
                                <button onClick={this.watchList} className="btn btn-outline-success my-2 my-sm-0">WatchList</button>                            </li>
                        </ul>
                        <div className="search navbar-nav ml-auto">
                            <input type="text" name="searchMovie" placeholder="Search a movie" required="required" onKeyPress={this.keyPressed} className="form-control mr-sm-2" value={this.state.searchValue} onChange={this.handleChange.bind(this)} />
                            <button onClick={this.search} type="submit" className="btn btn-outline-success my-2 my-sm-0"><i className="fa fa-search"></i></button>
                        </div>
                    </div>
                </nav>
                <div className="container">
                    <div>
                        <table id='movieresults'>
                            <tbody>
                                {this.renderTableDataCards()}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }

    componentDidMount() {
        this.getConfiguration();
        this.getPopularMovies();
    }

    renderTableDataCards() {
        if (this.state.items.length > 0) {
            return this.state.items.map((items, index) => {
                const { id, poster_path, title, overview, vote_average } = items
                return (
                    <tr key={id}>
                        <td>
                            <img src={this.createImageUrl(poster_path)} alt="movie poster" />
                        </td>
                        <td>
                            <div id="title">
                                <p>{title}</p>
                            </div>
                            <div>
                                <p>{overview}</p>
                            </div>
                            <div>
                                <p>Rating: {vote_average}</p> {this.renderFavouriteButton(index)} {this.renderAddToWatchButton(index)}
                            </div>
                        </td>
                    </tr>
                )
            });
        }
    }

    watchList() {
        if (this.state.watchList.length > 0) {
            return this.state.watchList.map((items, index) => {
                const { id, poster_path, title, overview, vote_average } = items
                return (
                    <tr key={id}>
                        <td>
                            <img src={this.createImageUrl(poster_path)} alt="movie poster" />
                        </td>
                        <td>
                            <div id="title">
                                <p>{title}</p>
                            </div>
                            <div>
                                <p>{overview}</p>
                            </div>
                            <div>
                                <p>Rating: {vote_average}</p> {this.renderFavouriteButton(index)} {this.renderAddToWatchButton(index)}
                            </div>
                        </td>
                    </tr>
                )
            });
        }
    }

    renderFavouriteButton(i) {
        return (
            <FavouriteButton
                value={this.state.items[i].isFavourite}
                onClick={() => this.handleFavourite(i)} />
        );
    }

    renderAddToWatchButton(i) {
        return (
            <AddToWatchButton
                value={this.state.items[i]}
                onClick={() => this.handleAddWatchList(i)} />
        );
    }

    renderDeleteToWatchButton(i) {
        return (
            <DeleteToWatchButton
                value={this.state.watchList[i]}
                onClick={() => this.handleDeleteWatchList(i)} />
        );
    }

    handleChange(event) {
        this.setState({ searchValue: event.target.value });
    }

    handleFavourite(i) {
        const items = this.state.items.slice();
        items[i].isFavourite = !items[i].isFavourite;
        this.setState({
            items: items,
        });
    }

    handleAddWatchList(i) {
        const watchList = this.state.watchList.slice();
        watchList.push(this.state.items[i]);
        this.setState({
            watchList: watchList,
        });
    }

    handleDeleteWatchList(i) {
        const watchList = this.state.watchList.slice();
        watchList.pop(this.state.watchList[i]);
        this.setState({
            watchList: watchList,
        });
    }

    toggleWatchListState() {
        this.setState({
            isWatchList: true,
        });
    }

    createImageUrl(filePath) {
        let baseUrl = this.state.config.images.base_url;
        let imageSize = this.state.config.images.poster_sizes[2];
        let completeUrl = baseUrl + imageSize + filePath;
        return completeUrl;
    }

    keyPressed(event) {
        if (event.key === "Enter") {
            this.search();
        }
    }

    getConfiguration() {
        fetch("https://api.themoviedb.org/3/configuration?api_key=" + api_key)
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({
                        // isLoaded: true,
                        config: result
                    });
                },
                // Note: it's important to handle errors here
                // instead of a catch() block so that we don't swallow
                // exceptions from actual bugs in components.
                (error) => {
                    this.setState({
                        // isLoaded: true,
                        error
                    });
                }
            )
    }

    getPopularMovies() {
        fetch("https://api.themoviedb.org/3/movie/popular?api_key=" + api_key + "&language=en-US&page=1")
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({
                        isLoaded: true,
                        items: result.results,
                    });
                },
                // Note: it's important to handle errors here
                // instead of a catch() block so that we don't swallow
                // exceptions from actual bugs in components.
                (error) => {
                    this.setState({
                        // isLoaded: true,
                        error
                    });
                }
            )
    }

    search = () => {
        if (this.state.searchValue && this.state.searchValue !== "") {
            this.searchMovie();
        }
    }

    searchMovie = () => {
        fetch("https://api.themoviedb.org/3/search/movie?api_key=" + api_key + "&query=" + this.state.searchValue)
            .then(res => res.json())
            .then(
                (result) => {
                    console.log(result);
                    let data = result.results.map(obj => ({ ...obj, isFavourite: false }))
                    this.setState({
                        isLoaded: true,
                        items: data
                    });
                },
                // Note: it's important to handle errors here
                // instead of a catch() block so that we don't swallow
                // exceptions from actual bugs in components.
                (error) => {
                    console.log(error);
                    this.setState({
                        isLoaded: true,
                        error
                    });
                }
            )
    }
}

function FavouriteButton(props) {
    if (props.value) {
        return (
            <button
                className="favourite"
                onClick={props.onClick}>
                <i className="fa fa-star"></i>
            </button>
        );
    }
    else {
        return (
            <button
                className="favourite"
                onClick={props.onClick}>
                <i className="fa fa-star-o"></i>
            </button>
        );
    }
}

function AddToWatchButton(props) {
    return (
        <button
            onClick={props.onClick}>
            {"Watch Later"}
        </button>
    );
}

function DeleteToWatchButton(props) {
    return (
        <button
            onClick={props.onClick}>
            {"Remove"}
        </button>
    );
}

// ========================================

ReactDOM.render(
    <MovieTown />,
    document.getElementById('root')
);
