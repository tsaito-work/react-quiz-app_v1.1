import React, { useState, useEffect } from "react";
import { Data } from "../../data/QuestionData.json.js";
import { QuestionConst } from "../../data/Const.json.js";
import { QuestionDiv, AnswerDiv, PageButtonDiv, QuestionForm } from "../styles/QuestionCss";
import { Button } from "../styles/CommonCss";
import { useHistory, useLocation } from "react-router-dom";

/** locationから回答履歴を取得する */
function getSelectAnswer(location) {
    let selectAnswer = location.state && location.state.selectAnswer;
    if (selectAnswer === undefined) {
        selectAnswer = undefined;
    }
    return selectAnswer;
}

/** クイズ内容を表示するコンポーネント */
export default function Question(props) {
    let history = useHistory();
    let location = useLocation();

    // 画面情報取得
    const { questionIndex, questionResult, setViewData } = props;
    // 問題リスト取得
    const questionList = Data.map((data) => { return data; });
    const questionData = questionList[questionIndex];
    // 最終問題かを判定するフラグ
    const isResult = (questionList.length - 1) === questionIndex;

    // 選択した回答を保持するstate
    const [selectAnswer, setSelectAnswer] = useState();
    // 回答の成否を保持するstate
    const [isCorrect, setIsCorrect] = useState(false);
    // 回答を表示しているかを判定するstate
    const [putCorrect, setPutCorrect] = useState(false);


    /** ページ切り替えイベント発生時（questionIndexに変更が発生した場合）にコンポーネントの状態をupdateする */
    useEffect(() => {
        // 回答した問題があれば画面に設定する
        setSelectAnswer(getSelectAnswer(location));
    }, [location]);
 
    /** 
     * 回答選択イベント
     * 現在の画面状態をヒストリーに追加して画面を置き換える
     * event：イベント
     */
    const checkAnswer = (event) => {
        // 回答履歴をコピー
        let copyQuestionResult = [...questionResult];
        // 回答履歴をstateに追加
        setSelectAnswer(parseInt(event.target.id));
        // stateを追加して画面を更新
        history.replace({
            pathname: "/play",
            state: {
                questionIndex: questionIndex,
                questionResult: copyQuestionResult,
                selectAnswer: parseInt(event.target.id)
            }
        });
    };

    /** 回答表示ボタンイベント */
    const displayAnswer = () => {
        setIsCorrect((selectAnswer + 1) === questionData.correct)
        setPutCorrect(true);
    };

    /** 
     * ページ切り替えボタンイベント
     * targetPage：遷移先ページINDEX
     */
    const setPage = (targetPage) => {
        // 回答履歴をコピー
        let copyQuestionResult = [...questionResult];
        // 回答履歴をstateに追加
        copyQuestionResult.splice(questionIndex, 1, selectAnswer);
        setViewData(questionIndex + parseInt(targetPage), copyQuestionResult);
        // 全ての問題を回答した場合
        if (isResult) {
            // 結果ページ遷移
            history.push({
                pathname: "/result",
                state: { questionResult: copyQuestionResult, questionList: questionList }
            });
        } else {
            // 次の問題へ遷移
            history.push({
                pathname: "/play",
                state: {
                    questionIndex: questionIndex + parseInt(targetPage),
                    questionResult: copyQuestionResult
                }
            });
        }
    }

    return (

        <QuestionForm className="question-form">

            {/* Jsonから問題文を表示 */}
            {/* 回答の選択に因って背景色を変更 */}
            <QuestionDiv putCorrect={putCorrect} isCorrect={isCorrect} className="question-div">
                <div>
                    <span>{`問題：${questionData.id}`}</span>
                    <span className="result-text">
                        {putCorrect && (isCorrect ? "正解" : "不正解")}
                    </span>
                </div>
                <div>{questionData.question}</div>
                {putCorrect && <div className="question-commentary">{questionData.commentary}</div>}
            </QuestionDiv>

            {/* Jsonから回答を表示 */}
            {questionData.answer.map((answer, index) => (
                <AnswerDiv className="answer-div" key={index}>
                    <label htmlFor={index}>
                        <input
                            id={index}
                            type="radio"
                            name="radio"
                            value={answer}
                            onChange={checkAnswer}
                            checked={selectAnswer === index}
                        />
                        {answer}
                    </label>
                </AnswerDiv>
            ))}

            {/* 画面遷移ボタンを表示 */}
            <PageButtonDiv className="page-button-div">
                <Button type="button" className="page-button-correct" onClick={displayAnswer}>{"回答を見る"}</Button>
                <Button disabled={selectAnswer === undefined} type="button" className="page-button-next" onClick={() => setPage(QuestionConst.NEXT_PAGE_INDEX)}>{isResult ? "結果を見る" : "次の問題"}</Button>
            </PageButtonDiv>

        </QuestionForm>
    );
}