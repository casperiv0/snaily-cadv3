import * as React from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import AdminLayout from "../../components/admin/AdminLayout";
import AlertMessage from "../../components/alert-message";
import CadInfo from "../../interfaces/CadInfo";
import State from "../../interfaces/State";
import User from "../../interfaces/User";
import lang from "../../language.json";
import { updateCadSettings } from "../../lib/actions/admin";

interface Props {
  user: User;
  message: string;
  cadInfo: CadInfo;
  updateCadSettings: (data: {
    aop: string;
    cad_name: string;
    whitelisted: string;
    tow_whitelisted: string;
    company_whitelisted: string;
    webhook_url: string;
  }) => void;
}

const CadSettingsPage: React.FC<Props> = ({ user, message, cadInfo, updateCadSettings }) => {
  const [cadName, setCadName] = React.useState("");
  const [aop, setAop] = React.useState("");
  const [whitelisted, setWhitelisted] = React.useState("");
  const [towWhitelist, setTowWhitelist] = React.useState("");
  const [companyWl, setCompanyWl] = React.useState("");
  const [webhookUrl, setWebhookUrl] = React.useState("");

  React.useEffect(() => {
    if (cadInfo.id) {
      setCadName(cadInfo.cad_name);
      setAop(cadInfo.AOP);
      setWhitelisted(cadInfo.whitelisted);
      setTowWhitelist(cadInfo.tow_whitelisted);
      setCompanyWl(cadInfo.company_whitelisted);
      setWebhookUrl(cadInfo.webhook_url || "");
    }
  }, [cadInfo]);

  React.useEffect(() => {
    document.title = "CAD Settings - SnailyCAD";
  }, []);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    updateCadSettings({
      cad_name: cadName,
      aop,
      whitelisted,
      tow_whitelisted: towWhitelist,
      company_whitelisted: companyWl,
      webhook_url: webhookUrl,
    });
  }

  if (user?.rank !== "owner") {
    return <Redirect to="/forbidden" />;
  }

  return (
    <AdminLayout>
      {message ? <AlertMessage type="success" message={message} dismissible /> : null}
      <h3>{lang.admin.cad_settings.cad_settings}</h3>

      <div className="card bg-dark border-dark mt-3">
        <div className="card-header">
          <h4>{lang.admin.cad_settings.downloads}</h4>
        </div>

        <div className="card-body">
          <a download className="btn btn-primary mt-2 mb-2" href="/downloads/snailyCADv3-tow.zip">
            FiveM Call tow (/calltow)
          </a>
          <a
            download
            className="btn btn-primary mt-2 mb-2 ms-2"
            href="/downloads/snailyCADv3-911.zip"
          >
            FiveM Call 911 (/call911)
          </a>
        </div>
      </div>

      <div className="card bg-dark border-dark mt-3">
        <div className="card-header">
          <h4>{lang.admin.cad_settings.general_info}</h4>
        </div>

        <div className="card-body">
          <form onSubmit={onSubmit}>
            <div className="mb-3">
              <label className="form-label" htmlFor="cad_name">
                {lang.admin.cad_settings.cad_name}
              </label>
              <input
                type="text"
                className="form-control bg-secondary border-dark text-light"
                id="cad_name"
                value={cadName}
                onChange={(e) => setCadName(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label className="form-label" htmlFor="aop">
                {lang.admin.cad_settings.update_aop}
              </label>
              <input
                type="text"
                className="form-control bg-secondary border-dark text-light"
                id="aop"
                value={aop}
                onChange={(e) => setAop(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label className="form-label" htmlFor="webhook_url">
                {lang.admin.cad_settings?.update_webhook || "Update webhook URL"}
              </label>
              <input
                type="url"
                className="form-control bg-secondary border-dark text-light"
                id="webhook_url"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label className="form-label" htmlFor="whitelisted">
                {lang.admin.cad_settings.cad_wl}
              </label>
              <select
                className="form-control bg-secondary border-dark text-light"
                id="whitelisted"
                value={whitelisted}
                onChange={(e) => setWhitelisted(e.target.value)}
              >
                <option value={cadInfo.whitelisted}>
                  {cadInfo.whitelisted === "1" ? lang.global.yes : lang.global.no}
                </option>
                <option disabled value="">
                  --------
                </option>
                <option value="0">{lang.global.no}</option>
                <option value="1">{lang.global.yes}</option>
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label" htmlFor="tow_whitelisted">
                {lang.admin.cad_settings.tow_wl}
              </label>
              <select
                className="form-control bg-secondary border-dark text-light"
                id="tow_whitelisted"
                value={towWhitelist}
                onChange={(e) => setTowWhitelist(e.target.value)}
              >
                <option value={cadInfo.tow_whitelisted}>
                  {cadInfo.tow_whitelisted === "1" ? lang.global.yes : lang.global.no}
                </option>
                <option disabled value="">
                  --------
                </option>
                <option value="0">{lang.global.no}</option>
                <option value="1">{lang.global.yes}</option>
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label" htmlFor="company_whitelisted">
                {lang.admin.cad_settings.company_wl}
              </label>
              <select
                className="form-control bg-secondary border-dark text-light"
                id="company_whitelisted"
                value={companyWl}
                onChange={(e) => setCompanyWl(e.target.value)}
              >
                <option value={cadInfo.company_whitelisted}>
                  {cadInfo.company_whitelisted === "1" ? lang.global.yes : lang.global.no}
                </option>
                <option disabled value="">
                  --------
                </option>
                <option value="0">{lang.global.no}</option>
                <option value="1">{lang.global.yes}</option>
              </select>
            </div>
            <div className="mb-3">
              <button className="btn btn-primary col" type="submit">
                {lang.admin.cad_settings.update_cad}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
};

const mapToProps = (state: State) => ({
  cadInfo: state.global.cadInfo,
  message: state.global.message,
  user: state.auth.user,
});

export default connect(mapToProps, { updateCadSettings })(CadSettingsPage);
