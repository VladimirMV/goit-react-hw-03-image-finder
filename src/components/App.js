import React, { Component } from 'react';
import Button from './Button';
import ImageGallery from './ImageGallery';
import './App.css';
import { fetchImages } from './fetchImages/fetchImages';
import Searchbar from './Searchbar';
import Notiflix from 'notiflix';
import Loader from './Loader';

class App extends Component {
  state = {
    inputData: '',
    items: [],
    status: 'idle',
    totalHits: 0,
    page: 1,
  };

  async componentDidUpdate(_, prevState) {
    const { inputData, page } = this.state;

    if (
      this.state.inputData !== prevState.inputData ||
      page !== prevState.page
    ) {
      if (inputData.trim() === '') {
        Notiflix.Notify.info('You cannot search by empty field, try again.');
        return;
      } else {
        try {
          const { totalHits, hits } = await fetchImages(inputData, page);
          if (hits.length < 1) {
            this.setState({ status: 'idle' });
            Notiflix.Notify.failure(
              'Sorry, there are no images matching your search query. Please try again.'
            );
          } else {
            this.setState(prevState => ({
              items: [...prevState.items, ...hits],
              inputData: inputData,
              totalHits: totalHits,
              status: 'resolved',
            }));
          }
        } catch (error) {
          this.setState({ status: 'rejected' });
        }
      }
    }
  }

  handleSubmit = inputData => {
    console.log('handleSubmit = ', inputData, this.state.inputData);
    if (this.state.inputData === inputData) {
      return;
    }
    this.setState({
      inputData: inputData,
      items: [],
      status: 'idle',
      totalHits: 0,
      page: 1,
    });
  };

  onNextPage = () => this.setState(({ page }) => ({ page: page + 1 }));

  render() {
    const { status, items, totalHits, page } = this.state;

    return (
      <div className="App">
        <Searchbar onSubmit={this.handleSubmit} />
        {status === 'rejected' && <p>Something wrong, try later</p>}
        {status === 'pending' && <Loader />}
        {status === 'pending' && items.length > 0 && (
          <ImageGallery page={page} items={items} />
        )}
        {status === 'resolved' && <ImageGallery page={page} items={items} />}
        {status === 'resolved' && totalHits > items.length && (
          <Button onClick={this.onNextPage} />
        )}
      </div>
    );
  }
}

export default App;
