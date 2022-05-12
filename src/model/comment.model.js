import {generateComment} from '../mock/comment.mock';

export default class CommentModel {
  #comments = Array.from({ length: 1000 }, generateComment);

  getComments() {
    return this.#comments;
  }
}
