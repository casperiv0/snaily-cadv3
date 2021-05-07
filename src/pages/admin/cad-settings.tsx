import { connect } from "react-redux";
import * as React from "react";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";
import { verifyAuth } from "@actions/auth/AuthActions";
import { getCadInfo, updateCadSettings } from "@actions/global/GlobalActions";
import { initializeStore } from "@state/useStore";
import { AdminLayout } from "@components/admin/AdminLayout";
import { Nullable, State } from "types/State";
import { User } from "types/User";
import { Cad } from "types/Cad";
import { RequestData } from "@lib/utils";
import lang from "src/language.json";
import { Select } from "@components/Select/Select";
import { Seo } from "@components/Seo";

interface Props {
  user: Nullable<User>;
  cadInfo: Nullable<Cad>;
  updateCadSettings: (data: RequestData) => Promise<boolean>;
}

const AdminPage = ({ user, cadInfo, updateCadSettings }: Props) => {
  const router = useRouter();
  const [cadName, setCadName] = React.useState("");
  const [aop, setAop] = React.useState("");
  const [whitelisted, setWhitelisted] = React.useState("");
  const [towWhitelist, setTowWhitelist] = React.useState("");
  const [webhookUrl, setWebhookUrl] = React.useState("");
  const [plateLength, setPlateLength] = React.useState(8);
  const [liveMapUrl, setLiveMapUrl] = React.useState("");
  const [steamApiKey, setSteamApiKey] = React.useState("");
  const [showSteamKey, setShowSteamKey] = React.useState(false);
  const [features, setFeatures] = React.useState<string[]>([]);
  const [maxCitizens, setMaxCitizens] = React.useState<string>("unlimited");
  const [registrationCode, setRegCode] = React.useState("");
  const [showAop, setShowAop] = React.useState("");
  const [showRegCode, setShowRegCode] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [heightPrefix, setHeightPrefix] = React.useState("");
  const [weightPrefix, setWeightPrefix] = React.useState("");
  const [assignedStatus, setAssignedStatus] = React.useState("");
  const [onDutyCode, setOnDutyCode] = React.useState("");

  React.useEffect(() => {
    if (cadInfo?.id) {
      setCadName(cadInfo.cad_name);
      setAop(cadInfo.AOP);
      setWhitelisted(cadInfo.whitelisted);
      setTowWhitelist(cadInfo.tow_whitelisted);
      setWebhookUrl(cadInfo.webhook_url || "");
      setLiveMapUrl(cadInfo.live_map_url || "");
      setPlateLength(cadInfo.plate_length !== 0 ? cadInfo.plate_length : 8);
      setSteamApiKey(cadInfo.steam_api_key || "");
      setFeatures(cadInfo.features || []);
      setMaxCitizens(cadInfo.max_citizens ?? "unlimited");
      setShowAop(cadInfo.show_aop);
      setRegCode(cadInfo.registration_code);
      setHeightPrefix(cadInfo.height_prefix ?? "");
      setWeightPrefix(cadInfo.weight_prefix ?? "");
      setAssignedStatus(cadInfo.assigned_status ?? "10-97");
      setOnDutyCode(cadInfo.on_duty_status ?? "10-8");
    }
  }, [cadInfo]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    await updateCadSettings({
      cad_name: cadName,
      aop,
      whitelisted,
      tow_whitelisted: towWhitelist,
      webhook_url: webhookUrl,
      plate_length: plateLength,
      live_map_url: liveMapUrl,
      steam_api_key: steamApiKey,
      features: cadInfo?.features || [],
      max_citizens: maxCitizens,
      show_aop: showAop,
      registration_code: registrationCode,
      weight_prefix: weightPrefix,
      height_prefix: heightPrefix,
      assigned_status: assignedStatus,
      on_duty_status: onDutyCode,
    });

    setLoading(false);
  }

  async function onFeaturesSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!cadInfo) return;
    setLoading(true);

    await updateCadSettings({
      ...cadInfo,
      aop: cadInfo.AOP,
      show_aop: showAop,
      features,
    });

    setLoading(false);
  }

  function updateFeatures(feature: string) {
    if (features.includes(feature)) {
      setFeatures((prev) => prev.filter((f) => f !== feature));
    } else {
      setFeatures((prev) => [...prev, feature]);
    }
  }

  React.useEffect(() => {
    if (user?.rank !== "owner") {
      router.push("/403");
    }
  }, [router, user]);

  return (
    <AdminLayout>
      <Seo title={lang.admin.cad_settings.cad_settings} />

      <h3>{lang.admin.cad_settings.cad_settings}</h3>

      <div className="card bg-dark border-dark mt-3">
        <div className="card-header">
          <h4>{lang.admin.cad_settings.downloads}</h4>
        </div>

        <div className="card-body">
          <a
            rel="noopener noreferrer"
            target="_blank"
            href="https://github.com/Dev-CasperTheGhost/snaily-cadv3/tree/main/public/downloads"
          >
            FiveM addons (download via GitHub)
          </a>
          <a
            rel="noreferrer noopener"
            target="_blank"
            className="btn btn-primary mt-2 mb-2 ms-2"
            href="https://github.com/Dev-CasperTheGhost/live_map/"
          >
            Live Map addon
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
              <label className="form-label" htmlFor="webhook_url">
                {lang.admin.max_plate_length}
              </label>
              <input
                type="number"
                className="form-control bg-secondary border-dark text-light"
                id="plate_length"
                value={plateLength}
                onChange={(e) => setPlateLength(Number(e.target.value))}
              />
            </div>
            <div className="mb-3">
              <label className="form-label" htmlFor="webhook_url">
                {lang.admin.socket_url}
              </label>
              <input
                type="text"
                className="form-control bg-secondary border-dark text-light"
                id="live_map_url"
                value={liveMapUrl}
                onChange={(e) => setLiveMapUrl(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label className="form-label" htmlFor="steam_api_key">
                {lang.admin.steam_api_key}
              </label>

              <div className="input-group mb-3">
                <input
                  type={showSteamKey ? "text" : "password"}
                  className="form-control bg-secondary border-dark text-light"
                  id="steam_api_key"
                  value={steamApiKey}
                  onChange={(e) => setSteamApiKey(e.target.value)}
                  aria-describedby="show-steam-key"
                />
                <button
                  onClick={() => setShowSteamKey((v) => !v)}
                  className="btn btn-outline-secondary bg-light text-dark"
                  type="button"
                  id="show-steam-key"
                >
                  {showSteamKey ? lang.global.hide : lang.global.show}
                </button>
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label" htmlFor="max_citizens">
                {lang.admin.max_citizens}
              </label>
              <input
                type="text"
                className="form-control bg-secondary border-dark text-light"
                id="max_citizens"
                value={maxCitizens}
                placeholder="'unlimited' or number"
                onChange={(e) => setMaxCitizens(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label className="form-label" htmlFor="whitelisted">
                {lang.admin.cad_settings.cad_wl}
              </label>

              <Select
                isMulti={false}
                value={{
                  label: whitelisted === "1" ? lang.global.yes : lang.global.no,
                  value: whitelisted,
                }}
                isClearable={false}
                onChange={(v) => setWhitelisted(v.value)}
                options={[
                  { label: lang.global.yes, value: "1" },
                  { label: lang.global.no, value: "0" },
                ]}
              />
            </div>
            <div className="mb-3">
              <label className="form-label" htmlFor="tow_whitelisted">
                {lang.admin.cad_settings.tow_wl}
              </label>
              <Select
                isMulti={false}
                value={{
                  label: towWhitelist === "1" ? lang.global.yes : lang.global.no,
                  value: towWhitelist,
                }}
                isClearable={false}
                onChange={(v) => setTowWhitelist(v.value)}
                options={[
                  { label: lang.global.yes, value: "1" },
                  { label: lang.global.no, value: "0" },
                ]}
              />
            </div>
            <div className="mb-3">
              <label className="form-label" htmlFor="tow_whitelisted">
                {lang.admin.registration_code}
              </label>

              <div className="input-group mb-3">
                <input
                  type={showRegCode ? "text" : "password"}
                  className="form-control bg-secondary border-dark text-light"
                  id="steam_api_key"
                  value={registrationCode}
                  onChange={(e) => setRegCode(e.target.value)}
                  aria-describedby="show-reg-code"
                />
                <button
                  onClick={() => setShowRegCode((v) => !v)}
                  className="btn btn-outline-secondary bg-light text-dark"
                  type="button"
                  id="show-reg-code"
                >
                  {showRegCode ? lang.global.hide : lang.global.show}
                </button>
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label" htmlFor="weight_prefix">
                {lang.admin.weight_prefix}
              </label>
              <input
                type="text"
                className="form-control bg-secondary border-dark text-light"
                id="weight_prefix"
                value={weightPrefix}
                onChange={(e) => setWeightPrefix(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label className="form-label" htmlFor="height_prefix">
                {lang.admin.height_prefix}
              </label>
              <input
                type="text"
                className="form-control bg-secondary border-dark text-light"
                id="height_prefix"
                value={heightPrefix}
                onChange={(e) => setHeightPrefix(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label className="form-label" htmlFor="assigned_status">
                {lang.admin.assigned_status}
              </label>
              <input
                type="text"
                className="form-control bg-secondary border-dark text-light"
                id="assigned_status"
                value={assignedStatus}
                onChange={(e) => setAssignedStatus(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label className="form-label" htmlFor="on_duty_status">
                {lang.admin.on_duty_status}
              </label>
              <input
                type="text"
                className="form-control bg-secondary border-dark text-light"
                id="on_duty_status"
                value={onDutyCode}
                onChange={(e) => setOnDutyCode(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <button disabled={loading} className="btn btn-primary col" type="submit">
                {loading ? `${lang.global.loading}..` : lang.admin.save}
              </button>
            </div>
          </form>
        </div>
      </div>

      <form onSubmit={onFeaturesSubmit} className="card bg-dark border-dark mt-3 mb-5">
        <div className="card-header">
          <h4>{lang.admin.enable_disable_features}</h4>
        </div>

        <div className="card-body">
          <div className="mb-3">
            <div className="form-check form-switch">
              <input
                onChange={() => setShowAop(showAop === "1" ? "0" : "1")}
                checked={showAop === "1"}
                className="form-check-input"
                type="checkbox"
                id="show-aop-feature"
              />
              <label className="form-check-label" htmlFor="show-aop-feature">
                Show AOP
              </label>
            </div>
            When disabled, this will hide &quot;- AOP: aop here &quot;
          </div>
          <div className="mb-3">
            <div className="form-check form-switch">
              <input
                onChange={() => updateFeatures("bleeter")}
                checked={features.includes("bleeter")}
                className="form-check-input"
                type="checkbox"
                id="bleeter-feature"
              />
              <label className="form-check-label" htmlFor="bleeter-feature">
                Bleeter
              </label>
            </div>
            Bleeter is like twitter but for GTA,{" "}
            <a href="https://gta.fandom.com/wiki/Bleeter" rel="noreferrer noopener" target="_blank">
              find more information here
            </a>
            .
          </div>
          <div className="mb-3">
            <div className="form-check form-switch">
              <input
                onChange={() => updateFeatures("tow")}
                checked={features.includes("tow")}
                className="form-check-input"
                type="checkbox"
                id="tow-feature"
              />
              <label className="form-check-label" htmlFor="tow-feature">
                Tow
              </label>
            </div>
            Enable/Disable tow. When enabled, this will allow citizens to call tow.
          </div>
          <div className="mb-3">
            <div className="form-check form-switch">
              <input
                onChange={() => updateFeatures("truck-logs")}
                checked={features.includes("truck-logs")}
                className="form-check-input"
                type="checkbox"
                id="truck-logs-feature"
              />
              <label className="form-check-label" htmlFor="truck-logs-feature">
                Truck Logs
              </label>
            </div>
            When enabled, this will allow citizens to create truck logs and track their progress.
          </div>
          <div className="mb-3">
            <div className="form-check form-switch">
              <input
                onChange={() => updateFeatures("taxi")}
                checked={features.includes("taxi")}
                className="form-check-input"
                type="checkbox"
                id="taxi-feature"
              />
              <label className="form-check-label" htmlFor="taxi-feature">
                Taxi
              </label>
            </div>
            When enabled, this will allow citizens to call a taxi to pick them up.
          </div>
          <div className="mb-3">
            <div className="form-check form-switch">
              <input
                onChange={() => updateFeatures("courthouse")}
                checked={features.includes("courthouse")}
                className="form-check-input"
                type="checkbox"
                id="courthouse-feature"
              />
              <label className="form-check-label" htmlFor="courthouse-feature">
                Courthouse
              </label>
            </div>
            When enabled, this will allow citizens to create expungement requests
          </div>
          <div className="mb-3">
            <div className="form-check form-switch">
              <input
                onChange={() => updateFeatures("company")}
                checked={features.includes("company")}
                className="form-check-input"
                type="checkbox"
                id="company-feature"
              />
              <label className="form-check-label" htmlFor="company-feature">
                Company
              </label>
            </div>
            When enabled, this will allow citizens to create companies
          </div>

          <div className="d-flex">
            <button disabled={loading} className="btn btn-primary " type="submit">
              {loading ? `${lang.global.loading}..` : "Save Changes"}
            </button>
          </div>
        </div>
      </form>
    </AdminLayout>
  );
};

const mapToProps = (state: State) => ({
  cadInfo: state.global.cadInfo,
  user: state.auth.user,
});

export default connect(mapToProps, { updateCadSettings })(AdminPage);

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const store = initializeStore();
  await verifyAuth(req.headers)(store.dispatch);
  await getCadInfo(req.headers)(store.dispatch);

  return { props: { initialReduxState: store.getState() } };
};
