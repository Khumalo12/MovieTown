import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import '../node_modules/font-awesome/css/font-awesome.min.css';
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
            isLoaded: false,
            items: [],
            watchList: [],
            config: [],
        }
    }

    render() {
        return (
            <div>
                <div className="search">
                    <input type="text" name="searchMovie" placeholder="Search a movie" required="required" class="searchTerm" value={this.state.searchValue} onChange={this.handleChange.bind(this)} />
                    <button onClick={this.search} type="submit" class="searchButton"><i class="fa fa-search"></i></button>
                </div>
                <div>
                    <table id='movieresults'>
                        <tbody>

                            {/* <tr>{this.renderTableHeader()}</tr> */}
                            {this.renderTableDataCards()}
                        </tbody>
                    </table>
                </div>
                <div>
                    <table id='watchlist'>
                        <tbody>
                            {this.renderWatchListTableData()}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

    componentDidMount() {
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

    renderTableDataCards() {
        if (this.state.items.length > 0) {
            return this.state.items.map((items, index) => {
                const { poster_path, title, overview, release_date, vote_average } = items
                return (
                    <tr>
                        <td>
                            <img src={this.createImageUrl(poster_path)} alt="" />
                        </td>
                        <td>
                            <div id="title">
                                <p>{title}</p>
                            </div>
                            <div>
                                <p>{overview}</p>
                            </div>
                            <div>
                                <p>{release_date}</p>
                            </div>
                            <div>
                                <p>Rating: {vote_average}</p>
                            </div>
                        </td>
                    </tr>
                )
            });
        }
    }

    renderWatchListTableData() {
        if (this.state.watchList.length > 0) {
            return this.state.watchList.map((items, index) => {
                const { id, title, release_date } = items
                return (
                    <tr key={id}>
                        <td>{id}</td>
                        <td>{title}</td>
                        <td>{release_date}</td>
                        <td>{this.renderDeleteToWatchButton(index)}</td>
                    </tr>
                )
            });
        }
    }

    renderFavouriteButton(i) {
        return (
            <FavouriteButton
                value={this.state.items[i].isFavourite ? "true" : "false"}
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

    createImageUrl(filePath) {
        let baseUrl = this.state.config.images.base_url;
        let imageSize = this.state.config.images.poster_sizes[2];
        let completeUrl = baseUrl + imageSize + filePath;
        return completeUrl;
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
    return (
        <button
            onClick={props.onClick}>
            {(props.value === "true") ? 'true' : 'false'}
        </button>
    );
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

// class MovieResults extends React.Component {
//     render() {
//         return (
//             <div>
//                 <input type="text" name="searchMovie" />
//                 <button onClick={this.props.searchMovie}>Search</button>
//             </div>
//         );
//     }
// }

// ========================================

ReactDOM.render(
    <MovieTown />,
    document.getElementById('root')
);
