import React from 'react'
import { Button } from 'antd'
import { showCellTakenNotification } from './showNotifications'
import GameOverModal from './gameOverModal'
import { PLAYER_1, PLAYER_2, GRID_SIZE } from './enums'

const styles = {
  container: {
    height: '100vh',
    width: '100vw',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  header: {
    width: '100%',
    marginTop: '20px',
    marginBottom: '50px',
    paddingLeft: '20px',
    paddingRight: '20px',
    display: 'flex',
    justifyContent: 'space-between'
  },
  title: {
    fontSize: '30px'
  },
  table: {
    display: 'grid',
    gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
    height: '500px',
    width: '500px',
    border: '3px solid black'
  },
  playerTurnContainer: {
    display: 'flex',
    alignItems: 'center'
  },
  playerTurn: {
    fontSize: '18px',
    marginRight: '15px'
  },
  cell: {
    border: '3px solid black',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100%'
  },
  mark: {
    fontSize: '3em'
  }
}

class Game extends React.Component {
  state = {
    cells: [],
    currentPlayer: 'Player 1',
    firstPlayerMoves: [],
    secondPlayerMoves: [],
    winningPlayer: null,
    showModal: false,
    isTie: false
  }

  componentDidMount() {
    this.setBoard()
  }

  setBoard = () => {
    const cells = []
    for (let row = 1; row <= GRID_SIZE; row++) {
      for (let column = 1; column <= GRID_SIZE; column++) {
        cells.push({
          row,
          column,
          mark: null
        })
      }
    }

    this.setState({ cells })
  }

  restartGame = () => {
    this.setState({
      currentPlayer: 'Player 1',
      firstPlayerMoves: [],
      secondPlayerMoves: [],
      winningPlayer: null,
      showModal: false,
      isTie: false
    })

    this.setBoard()
  }

  addToPlayerMoves = ({ row, column }) => {
    const currentPlayerStateKey =
      this.state.currentPlayer === PLAYER_1
        ? 'firstPlayerMoves'
        : 'secondPlayerMoves'
    this.setState({
      [currentPlayerStateKey]: [
        ...this.state[currentPlayerStateKey],
        { row, column }
      ]
    })
  }

  handleClickCell = ({ row, column }) => async () => {
    const cells = []
    for (let cell of this.state.cells) {
      if (cell.row === row && cell.column === column) {
        if (cell.mark) {
          return showCellTakenNotification()
        }
        cell.mark = this.state.currentPlayer === PLAYER_1 ? 'X' : 'O'
      }
      cells.push(cell)
    }

    await this.addToPlayerMoves({ row, column })
    this.checkWinConditions()
    this.checkTieCondition()

    this.setState({
      cells,
      currentPlayer: this.state.currentPlayer === PLAYER_1 ? PLAYER_2 : PLAYER_1
    })
  }

  checkTieCondition = () => {
    const totalMoves = this.state.cells.filter(cell => cell.mark).length
    if (totalMoves === GRID_SIZE * GRID_SIZE) {
      this.setState({
        showModal: true,
        isTie: true
      })
    }
  }

  checkWinConditions = () => {
    this.checkStraightWin('row')
    this.checkStraightWin('column')
    this.checkDiagonalWin('ascending')
    this.checkDiagonalWin('descending')
  }

  checkStraightWin = orientation => {
    const currentPlayerMoves =
      this.state.currentPlayer === PLAYER_1
        ? this.state.firstPlayerMoves
        : this.state.secondPlayerMoves

    const count = {}
    for (let move of currentPlayerMoves) {
      count[move[orientation]] = (count[move[orientation]] || 0) + 1
      if (count[move[orientation]] === GRID_SIZE) {
        this.setState({
          winningPlayer: this.state.currentPlayer,
          showModal: true
        })
      }
    }
  }

  checkDiagonalWin = orientation => {
    const currentPlayerMoves =
      this.state.currentPlayer === PLAYER_1
        ? this.state.firstPlayerMoves
        : this.state.secondPlayerMoves

    // for a 3x3 grid win condition
    // descending: {row: 1, column: 1}, {row: 2, column: 2}, {row: 3, column: 3}
    // ascending: {row: 1, column: 3}, {row: 2, column: 2}, {row: 3, column: 1}
    let diagonalWinCondition = []
    if (orientation === 'ascending') {
      for (let grid = 1; grid <= GRID_SIZE; grid++) {
        diagonalWinCondition.push({
          row: grid,
          column: GRID_SIZE - grid + 1
        })
      }
    } else if (orientation === 'descending') {
      for (let grid = 1; grid <= GRID_SIZE; grid++) {
        diagonalWinCondition.push({
          row: grid,
          column: grid
        })
      }
    }

    for (let move of currentPlayerMoves) {
      diagonalWinCondition = diagonalWinCondition.filter(
        winMove => !(winMove.row === move.row && winMove.column === move.column)
      )

      if (!diagonalWinCondition.length) {
        this.setState({
          winningPlayer: this.state.currentPlayer,
          showModal: true
        })
      }
    }
  }

  renderHeader() {
    return (
      <header style={styles.header}>
        <div style={styles.title}>Tic Tac Toe</div>
        <div style={styles.playerTurnContainer}>
          <div style={styles.playerTurn}>{`${
            this.state.currentPlayer
          }'s turn`}</div>
          <Button onClick={this.restartGame}>Restart Game</Button>
        </div>
      </header>
    )
  }

  renderCell(cell, i) {
    return (
      <div
        key={i}
        style={styles.cell}
        onClick={this.handleClickCell({
          row: cell.row,
          column: cell.column
        })}
      >
        {cell.mark && <span style={styles.mark}>{cell.mark}</span>}
      </div>
    )
  }

  render() {
    return (
      <div style={styles.container}>
        <GameOverModal
          winningPlayer={this.state.winningPlayer}
          restartGame={this.restartGame}
          showModal={this.state.showModal}
          isTie={this.state.isTie}
        />
        {this.renderHeader()}
        <div style={styles.table}>
          {this.state.cells.map((cell, i) => {
            return this.renderCell(cell, i)
          })}
        </div>
      </div>
    )
  }
}

export default Game
