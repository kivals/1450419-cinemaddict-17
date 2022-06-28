import {CommentView} from '../view/comment/comment.view';
import {render, replace} from '../framework/render';
import {CommentsTitleView} from '../view/comment/comments-title.view';
import {CommentsListView} from '../view/comment/comments-list.view';
import {CommentsAddNewView} from '../view/comment/comments-add-new.view';
import {UpdateType, UserAction} from '../common/constants';
import {nanoid} from 'nanoid';

export class CommentsPresenter {
  #commentsContainerComp = null;
  #commentsTitleComp = new CommentsTitleView();
  #commentsListComp = new CommentsListView();
  #commentAddComp = new CommentsAddNewView();

  #comments = null;
  #filmId = null;

  #changeComment = null;

  constructor(commentsContainer, changeComment) {
    this.#commentsContainerComp = commentsContainer;
    this.#changeComment = changeComment;
  }

  init(comments, filmId) {
    this.#comments = comments;
    this.#filmId = filmId;

    this.#render();
  }

  #initListeners() {
    this.#commentAddComp.setChangeEmojiHandler(this.#changeEmojiHandler);
    this.#commentAddComp.setSubmitCommentHandler(this.#submitCommentHandler);
  }

  #render() {
    render(this.#commentsTitleComp, this.#commentsContainerComp.element);
    render(this.#commentsListComp, this.#commentsContainerComp.element);
    this.#comments.forEach((comment) => this.#renderCommentItem(comment));
    render(this.#commentAddComp, this.#commentsContainerComp.element);

    this.#initListeners();
  }

  #changeEmojiHandler = ({emoji, text}) => {
    const prevCommentAddComp = this.#commentAddComp;
    this.#commentAddComp = new CommentsAddNewView(emoji, text);

    this.#initListeners();

    replace(this.#commentAddComp, prevCommentAddComp);
  };

  #submitCommentHandler = ({ emoji, text}) => {
    this.#changeComment(
      UserAction.ADD_COMMENT,
      UpdateType.MINOR,
      {
        id: nanoid(),
        author: 'Новый автор',
        comment: text,
        emotion: emoji,
        filmId: this.#filmId
      }
    );
  };

  #renderCommentItem(comment) {
    const commentComp = new CommentView(comment);
    commentComp.setDeleteHandler(this.#deleteCommentHandler);
    render(commentComp, this.#commentsListComp.element);
  }

  #deleteCommentHandler = (comment) => {
    this.#changeComment(
      UserAction.DELETE_COMMENT,
      UpdateType.MINOR,
      comment
    );
  };
}
