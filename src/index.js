import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import '../node_modules/font-awesome/css/font-awesome.min.css';

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
                            <tr>{this.renderTableHeader()}</tr>
                            {this.renderTableData()}
                        </tbody>
                    </table>
                </div>
                <div>
                    <table id='watchlist'>
                        <tbody>
                            <tr>{this.renderTableHeader()}</tr>
                            {this.renderWatchListTableData()}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

    renderTableHeader() {
        if (this.state.isLoaded) {
            let header = ["ID", "TITLE", "RELEASE_DATE", "FAVOURITE", "WATCHLIST"];
            return header.map((key, index) => {
                return <th key={index}>{key.toUpperCase()}</th>
            });
        }
    }

    renderTableData() {
        if (this.state.items.length > 0) {
            return this.state.items.map((items, index) => {
                const { id, title, release_date, backdrop_path } = items
                return (
                    <tr key={id}>
                        <td>{id}</td>
                        <td>{title}</td>
                        <td>{release_date}</td>
                        <td>{backdrop_path}</td>
                        <td>{this.renderFavouriteButton(index)}</td>
                        <td>{this.renderAddToWatchButton(index)}</td>
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

    search = () => {
        if (this.state.searchValue && this.state.searchValue !== "") {
            this.searchMovie();
        }
    }

    searchMovie = () => {
        fetch("https://api.themoviedb.org/3/search/movie?api_key=1c4084dde4ea7820d6787ebf2c0846e5&query=" + this.state.searchValue)
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
