import AbstractView from "../../framework/view/abstract-view";
const createContainerTemplate = () => `
    <section class="film-details__comments-wrap"></section>
 `;
export class CommentsContainerView extends AbstractView{
  constructor() {
    super();
  }

  get template() {
    return createContainerTemplate();
  }
}
