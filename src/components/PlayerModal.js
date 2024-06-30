import React from 'react';
import Modal from 'react-modal';
import ReactPlayer from 'react-player';

Modal.setAppElement('#__next'); // To avoid screen reader issues

const PlayerModal = ({ isOpen, onRequestClose, episode, onPrevious, onNext, sources }) => {
  const videoUrl = sources.find((source) => source.quality === '1080p')?.source || sources[0]?.source;

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Player Modal"
      className="Modal"
      overlayClassName="Overlay"
    >
      <div className="text-gray-200">
        <h2 className="text-2xl font-bold text-center mb-4 text-yellow-500">{episode.title}</h2>
        {videoUrl ? (
          <ReactPlayer
            url={videoUrl}
            controls
            width="100%"
            height="100%"
            className="rounded-lg shadow-lg"
          />
        ) : (
          <p className="text-center text-red-500">No video source available</p>
        )}
        <div className="flex justify-between mt-6">
          <button onClick={onPrevious} className="bg-yellow-500 text-gray-800 px-4 py-2 rounded hover:bg-yellow-600">
            Previous Episode
          </button>
          <button onClick={onNext} className="bg-yellow-500 text-gray-800 px-4 py-2 rounded hover:bg-yellow-600">
            Next Episode
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default PlayerModal;
