import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

    function Square(props) {
        const squareClasses = props.isWinner ? 'square winningSquare' : 'square'
        return (
            <button className={squareClasses} onClick={props.onClick}>
                {props.value}
            </button>
        );
    }

  class Board extends React.Component {
    renderSquare(i) {
      return (
      <Square key={'square_' + i}
          value={ this.props.squares[i] } 
          onClick={() => this.props.onClick(i)}
          isWinner={this.props.winner && this.props.winner.winningSquares.includes(i)}
      />);
    }
  
    render() {
        let board = [];
        let values = [0,1,2,3,4,5,6,7,8]
        for(let j = 0; j < 3; j++) {
            board.push(<div className="board-row" key={'row_' +j} />)
            for (let i = 0; i < 3; i++) {
                board.push(this.renderSquare(values.shift()));
            }
        }
      return (
        <div>
            {board}
        </div>
      );
    }
  }  
  
  class Game extends React.Component {
      constructor(props) {
          super(props);
          this.state = {
              history: [
                  { 
                      squares : Array(9).fill(null),
                      moveTaken : null,
                  }
                ],
                stepNumber : 0,
                xIsNext: true,
                isAsc: false,
          }
      }

    handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    let moveTaken = null;
    const moves = [
        '1,1',
        '1,2',
        '1,3',
        '2,1',
        '2,2',
        '2,3',
        '3,1',
        '3,2',
        '3,3',
    ]
    
    if (calculateWinner(squares) || squares[i]) {
        return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    moveTaken = moves.slice(i,i+1);
    this.setState({ 
            history: history.concat([
            {
                squares: squares,
                moveTaken: moveTaken,
            }
        ]),
            stepNumber : history.length,
            xIsNext: !this.state.xIsNext,
        })
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2 ) === 0,
        });
    }

    flipOrder(){
        this.setState({
            isAsc: !this.state.isAsc
        });
    }

    render() {

        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner =  calculateWinner(current.squares) ? calculateWinner(current.squares) : null;
        let btn_class = ''

        let moves = history.map((value, index) => {
            const desc = index ?
                'Go to move #' + index + ' at (' + value.moveTaken + ')' :
                'Go to game start';

            index === this.state.stepNumber ? btn_class = 'currentStep' : btn_class = '';
            return (
                <li key={index} >
                    <button className={btn_class} onClick={() => this.jumpTo(index) }> {desc} </button>
                </li>
            );
        });

        let status = '';
        if (winner) {
            status = 'Winner: ' + winner.symbol;
        } else if (isDraw(current.squares)) {
            status = " It's a draw..."
         } 
        else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }

        const order = this.state.isAsc ? 'Ascending' : 'Descending';
      return (
        <div className="game">
          <div className="game-board">
            <Board 
                squares={current.squares}
                onClick={(i) => this.handleClick(i)}
                winner={winner}
            />
          </div>
          <div className="game-info">
            <div>{ status}</div>
            <ol className={order}> {moves}</ol>
            <button onClick={() => this.flipOrder()}> flip to {order} history </button>
          </div>
        </div>
      );
    }
  }

  function calculateWinner(squares){
    const lines = [
        [0,1,2],
        [3,4,5],
        [6,7,8],
        [0,3,6],
        [1,4,7],
        [2,5,8],
        [0,4,8],
        [2,4,6],
    ];
    for( let i = 0; i <lines.length ; i++) {
        const [a,b,c] = lines[i];
        if (squares[a] && squares[a]===squares[b] && squares[a] === squares[c]){
            return {
                symbol: squares[a],
                winningSquares: [a,b,c],
            };
        }
    }
    return null;
  }

  function isDraw(squares){
    for(let i = 0; i < squares.length; i++) {
        if(!squares[i]) {
            return false;
        }
    }
    return true;
  }

  
  ReactDOM.render(
    <Game />,
    document.getElementById('root')
  );
  