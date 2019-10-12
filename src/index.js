import React from 'react';
import ReactDOM from 'react-dom';
import ModalVideo from 'react-modal-video';
import './index.css';
import '../node_modules/font-awesome/css/font-awesome.min.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../node_modules/react-modal-video/css/modal-video.min.css';


const api_key = "1c4084dde4ea7820d6787ebf2c0846e5";
const base_url = "https://api.themoviedb.org/3/";
// const youtube_base_url = "https://www.youtube.com/watch?v=";

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
            searchpages: 1,
            currentsearchpage: 0,
            previouspage: 1,
            nextpage: 2,
            youtubekey: "",
            isOpen: false,
            enablePagination: false,
            genres: [],
            items: [],
            watchList: [],
            config: [],
        }
        this.openModal = this.openModal.bind(this)
    }

    openModal() {
        this.setState({ isOpen: true })
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
                {this.renderPagination()}
                <div>
                    <ModalVideo channel='youtube' isOpen={this.state.isOpen} videoId={this.state.youtubekey} onClose={() => this.setState({ isOpen: false })} />
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
                                {this.renderFavouriteButton(index)} {this.renderTrailerButton(id)} {this.renderAddToWatchButton(index)}
                            </div>
                        </td>
                    </tr>
                )
            });
        }
        else {
            return (
                <div className="NotFound">
                    <p>Oops! that movie does not exist</p>
                </div>
            )
        }
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
                onClick={() => this.handleTrailer(i)} />
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

    renderPagination() {
        if(this.state.enablePagination)
        {
            let items = [];
            for (let index = 1; index <= this.state.searchpages; index++) {
                items.push(
                    <li key={index} className="page-item">
                        <button className="page-link" onClick={() => this.handlePager(index)}>{index}</button>
                    </li>
                );
            }
            return (
                <div>
                    <nav aria-label="Page navigation">
                        <ul className="pagination justify-content-center">
                            <li className="page-item"><button className="page-link" onClick={() => this.handlePager(this.state.previouspage)}>Previous</button></li>
                            {items}
                            <li className="page-item"><button className="page-link" onClick={() => this.handlePager(this.state.nextpage)}>Next</button></li>
                        </ul>
                    </nav>
                </div>
            )
        }
    }

    handlePager(pageNumber) {
        if(pageNumber === 0)
        {
            return;
        }
        this.setState({
            previouspage: pageNumber - 1,
            currentsearchpage: pageNumber,
            nextpage: pageNumber + 1
        }, () =>
            this.searchMovie());
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

    handleTrailer(id) {
        this.getTrailerKey(id);
        this.openModal();
    }

    createImageUrl(filePath) {
        let baseUrl = this.state.config.images.base_url;
        let imageSize = this.state.config.images.poster_sizes[2];
        let completeUrl = baseUrl + imageSize + filePath;
        return completeUrl;
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

    getTrailerKey = (id) => {
        fetch(base_url + "movie/" + id + "/videos?api_key=" + api_key + "&language=en-US&page=1")
            .then(res => res.json())
            .then(
                (result) => {
                    if (result.results.length > 0) {
                        for (let index = 0; index < result.results.length; index++) {
                            if (result.results[index].type === "Trailer") {
                                this.setState({
                                    youtubekey: result.results[index].key,
                                });
                                break;
                            }
                        }
                    }
                    else
                    {
                        this.setState({
                            youtubekey: "",
                        })
                    }
                },
                (error) => {
                    console.log(error);
                }
            )
    }

    watchList = () => {
        this.setState({
            items: this.state.watchList,
            enablePagination: false,
        })
    }

    keyPressed = (event) => {
        if (event.key === "Enter") {
            this.search();
        }
    }

    getPopularMovies = () => {
        fetch(base_url + "movie/popular?api_key=" + api_key + "&language=en-US&page=1")
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({
                        items: result.results,
                        enablePagination: false,
                    });
                },
                (error) => {
                    console.log(error);
                }
            )
    }

    search = () => {
        if (this.state.searchValue && this.state.searchValue !== "") {
            this.setState({
                currentsearchpage: 1
            }, () =>
                this.searchMovie());
        }
    }

    searchMovie = () => {
        fetch(base_url + "search/movie?api_key=" + api_key + "&query=" + this.state.searchValue + "&page=" + this.state.currentsearchpage)
            .then(res => res.json())
            .then(
                (result) => {
                    let data = result.results.map(obj => ({ ...obj, isFavourite: false }))
                    this.setState({
                        items: data,
                        searchpages: result.total_pages,
                        enablePagination: true,
                    });
                },
                (error) => {
                    console.log(error);
                }
            )
    }
}

function FavouriteButton(props) {
    if (props.value) {
        return (
            <button className="FavouriteButton btn"
                onClick={props.onClick}>
                {"Favourite"}
            </button>
        );
    }
    else {
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
