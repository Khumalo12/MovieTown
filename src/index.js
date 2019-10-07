import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class MovieTown extends React.Component {
    render() {
        return (
            <div className="movieview">
                <div className="movies-search">
                    <MovieView />
                </div>
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
                <div>
                    <input type="text" name="searchMovie" placeholder="Search a movie" required="required" value={this.state.searchValue} onChange={this.handleChange.bind(this)} />
                    <button onClick={this.search}>Search</button>
                </div>
                <div>
                    <table id='items'>
                        <tbody>
                            <tr>{this.renderTableHeader()}</tr>
                            {this.renderTableData()}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

    renderTableHeader() {
        if (this.state.isLoaded) {
            let header = ["ID", "TITLE", "RELEASE_DATE", "FAVOURITE"];
            return header.map((key, index) => {
                return <th key={index}>{key.toUpperCase()}</th>
            });
        }
    }

    renderTableData() {
        if (this.state.items.length > 0) {
            return this.state.items.map((items, index) => {
                const { id, title, release_date} = items
                return (
                    <tr key={id}>
                        <td>{id}</td>
                        <td>{title}</td>
                        <td>{release_date}</td>
                        <td>{this.renderFavouriteButton(index)}</td>
                    </tr>
                )
            });
        }
    }

    renderFavouriteButton(i) {
        return (
            <FavouriteButton
                value={this.state.items[i].isFavourite ? "true" : "false"}
                onClick={() => this.handleClick(i)} />
        );
    }

    handleChange(event) {
        this.setState({ searchValue: event.target.value });
    }

    handleClick(i){
        const items = this.state.items.slice();
        items[i].isFavourite = !items[i].isFavourite;
        this.setState({
            items: items,
        });
    }

    search = () => {
        if(this.state.searchValue && this.state.searchValue !== "")
        {
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
            {(props.value === "true")  ? 'true' : 'false'}
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
