import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Button } from 'antd'

class GameOverModal extends React.Component {
  static propTypes = {
    winningPlayer: PropTypes.string,
    restartGame: PropTypes.func.isRequired,
    showModal: PropTypes.bool.isRequired,
    isTie: PropTypes.bool.isRequired
  }

  handleRestartClick = () => {
    this.props.restartGame()
  }

  render() {
    let modalMessage = this.props.isTie
      ? 'The game is a tie.'
      : `${this.props.winningPlayer} won!`
    return (
      <Modal
        visible={this.props.showModal}
        closable={false}
        footer={[
          <Button key="restart" onClick={this.handleRestartClick}>
            Restart Game
          </Button>
        ]}
      >
        {modalMessage}
      </Modal>
    )
  }
}

export default GameOverModal
