import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import '../node_modules/font-awesome/css/font-awesome.min.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './ajaxservice';

const api_key = "1c4084dde4ea7820d6787ebf2c0846e5";
const base_url = "https://api.themoviedb.org/3/";

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
            genres: [],
            items: [],
            watchList: [],
            config: [],
        }
    }

    render() {
        return (
            <div className="container">
                <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                    <button className="navbar-brand" onClick={this.getPopularMovies}><img src={"https://cdn130.picsart.com/288739624061211.png?c256x256"} width="120" alt="movie poster" />
                        MOVIETOWN</button>
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <div className="search search navbar-nav mr-auto">
                            <input type="text" name="searchMovie" placeholder="Search a movie" required="required" onKeyPress={this.keyPressed} className="form-control mr-sm-2" value={this.state.searchValue} onChange={this.handleChange.bind(this)} />
                            <button onClick={this.search} type="submit" className="btn btn-outline-success my-2 my-sm-0"><i className="fa fa-search"></i></button>
                        </div>
                        <ul className="navbar-nav ml-auto">
                            <li className="nav-item active">
                                <button onClick={this.watchList} className=" WatchListViewButton btn my-2 my-sm-0">WatchList</button>                            </li>
                        </ul>
                    </div>
                </nav>
                <div>
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
        this.getGenre();
        this.getPopularMovies();
    }

    renderTableDataCards() {
        if (this.state.items.length > 0) {
            return this.state.items.map((items, index) => {
                const { id, poster_path, title, overview, vote_average, genre_ids } = items
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
                                <p className="genre">Genre:</p><p className="genrenames">{this.renderGenre(genre_ids)}</p>
                            </div>
                            <div>
                                <p>Rating: {vote_average}</p>
                            </div>
                            <div>
                                {this.renderFavouriteButton(index)} {this.renderTrailerButton(index)} {this.renderAddToWatchButton(index)}
                            </div>
                        </td>
                    </tr>
                )
            });
        }
        else{
            return (
            <div className = "NotFound">
                <p>Oops that movie does not exist</p>
            </div>
            )
        }
    }

    watchList = () => {
        this.setState({
            items: this.state.watchList,
        })
    }

    renderFavouriteButton(i) {
        return (
            <FavouriteButton
                value={this.state.items[i].isFavourite}
                onClick={() => this.handleFavourite(i)} />
        );
    }

    renderTrailerButton(i) {
        return (
            <TrailerButton
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

    renderGenre(genre_ids) {
        let genres = [];
        genre_ids.forEach(element => {
            genres.push(this.state.genres.genres.find(({ id }) => id === element).name + "\n");
        });
        return genres;
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

    keyPressed = (event) => {
        if (event.key === "Enter") {
            this.search();
        }
    }

    getConfiguration() {
        fetch(base_url + "configuration?api_key=" + api_key)
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({
                        config: result
                    });
                },
                (error) => {
                    this.setState({
                        error
                    });
                }
            )
    }

    getGenre() {
        fetch(base_url + "genre/movie/list?api_key=" + api_key)
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({
                        genres: result
                    });
                },
                (error) => {
                    this.setState({
                        error
                    });
                }
            )
    }

    getPopularMovies = () => {
        fetch(base_url + "movie/popular?api_key=" + api_key + "&language=en-US&page=1")
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({
                        //isLoaded: true,
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
        fetch(base_url + "search/movie?api_key=" + api_key + "&query=" + this.state.searchValue)
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
    if(props.value)
    {
        return (
            <button className="FavouriteButton btn"
                onClick={props.onClick}>
                {"Favourite"}
            </button>
        );
    }
    else
    {
        return (
            <button className="NegativeFavouriteButton btn"
                onClick={props.onClick}>
                {"Favourite"}
            </button>
        );
    }
    
}

function TrailerButton(props) {
    return (
        <button className="TrailerButton btn"
            onClick={props.onClick}>
            {"Play Trailer"}
        </button>
    );
}

function AddToWatchButton(props) {
    return (
        <button className="WatchListButton btn"
            onClick={props.onClick}>
            {"Add to Watch List"}
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
