import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

export interface SquareProps {
    value: string;
    onClick: () => void;
}

// Use a Function Component because it 
export function Square(props: SquareProps) {
    return (
        <button className="square" onClick={props.onClick}>
            {props.value}
        </button>
    );
}

export interface BoardProps {
    squares: Array<string>;
    onClick: (i: number) => void;
}

export interface BoardState {
    squares: Array<string>;
    xIsNext: boolean;
}
export class Board extends React.Component<BoardProps, BoardState> {
    renderSquare(i: number) {
        return (
            <Square
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
            />
        );
    }

    render() {
        return (
            <div>
                <div className="board-row">
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                </div>
                <div className="board-row">
                    {this.renderSquare(3)}
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                </div>
                <div className="board-row">
                    {this.renderSquare(6)}
                    {this.renderSquare(7)}
                    {this.renderSquare(8)}
                </div>
            </div>
        );
    }
}

export interface GameProps {

}
export interface GameState {
    history: Array<{ squares: Array<string> }>;
    stepNumber: number;
    xIsNext: boolean;
}
export class Game extends React.Component<GameProps, GameState> {
    constructor(props: GameProps) {
        super(props)

        // State managed by this Component
        this.state = {
            history: [{ // History of the board
                squares: Array(9).fill(null)
            }],
            stepNumber: 0, // Step which the current board is showing
            xIsNext: true // true: X's turn, false: O's turn
        }
    }

    /**
     * Handler triggered when whichever square of the board is clicked
     * @param i Number of clicked square
     */
    handleClick(i: number) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();

        // Block updating the board if it's prohibited
        if (calculateWinner(squares) || squares[i]) {
            return;
        }

        // Update the status of the board
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares: squares,
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });
    }

    /**
     * Jump to the previous/future state
     * @param step Step we want to go
     */
    jumpTo(step: number) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);

        // Create a list of buttons for jumping
        const moves = history.map((step, move) => {
            const desc = move ?
                'Go to move #' + move :
                'Go to game start';
            return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>{desc}</button>
                </li>
            );
        });

        let status;
        if (winner) {
            status = 'Winner: ' + winner;
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }

        return (
            <div className="game">
                <div className="game-board">
                    {/* These props will be propagated to Board Component and re-rendered if needed */}
                    <Board
                        squares={current.squares}
                        onClick={(i: number) => this.handleClick(i) /* When we want to progagate a handler. It needs to be a function object of the handler */}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}

/**
 * Calculate whether the status of the board has a winner or not.
 * @param squares Array of square
 * @returns 'X' or 'O' or null (if there are no winner)
 */
function calculateWinner(squares: Array<string>) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null;
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);