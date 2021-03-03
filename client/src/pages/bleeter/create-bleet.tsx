import * as React from "react";
import { connect } from "react-redux";
import Layout from "../../components/Layout";
import State from "../../interfaces/State";
import lang from "../../language.json";
import AlertMessage from "../../components/alert-message";
import { createBleet } from "../../lib/actions/bleeter";
import Message from "../../interfaces/Message";
import { Link } from "react-router-dom";

interface Props {
  message: Message | null;
  createBleet: (data: { title: string; body: string; image: any }) => void;
}

const CreateBleetPage: React.FC<Props> = ({ message, createBleet }) => {
  const [title, setTitle] = React.useState("");
  const [body, setBody] = React.useState("");
  const [image, setImage] = React.useState<any>(null);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    createBleet({
      title,
      body,
      image,
    });
  }

  return (
    <Layout>
      <AlertMessage message={message} dismissible />

      <form onSubmit={onSubmit}>
        <div className="mb-3">
          <label className="form-label" htmlFor="title">
            {lang.bleeter.bleet_title}
          </label>
          <input
            type="file"
            id="image"
            className="form-control bg-dark border-dark text-light"
            onChange={(e) => setImage(e.target.files![0])}
          />
        </div>

        <div className="mb-3">
          <label className="form-label" htmlFor="title">
            {lang.bleeter.bleet_title}
          </label>
          <input
            type="text"
            value={title}
            id="title"
            className="form-control bg-dark border-dark text-light"
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label" htmlFor="body">
            {lang.bleeter.bleet_body}
          </label>
          <textarea
            className="form-control bg-dark border-dark text-light"
            title="body"
            value={body}
            rows={10}
            style={{ resize: "vertical" }}
            onChange={(e) => setBody(e.target.value)}
          ></textarea>
        </div>

        <div className="mb-3 float-end">
          <Link className="btn btn-danger" to="/bleeter">
            {lang.global.cancel}
          </Link>

          <button className="btn btn-primary ms-2" type="submit">
            {lang.bleeter.create_bleet}
          </button>
        </div>
      </form>
    </Layout>
  );
};

const mapToProps = (state: State) => ({
  message: state.global.message,
});

export default connect(mapToProps, { createBleet })(CreateBleetPage);
