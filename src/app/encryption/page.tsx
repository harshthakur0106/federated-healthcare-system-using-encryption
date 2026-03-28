const steps = [
  "Local model trained",
  "Encrypted using AES",
  "AES key encrypted with RSA",
  "Sent to server",
  "Decrypted",
  "Global model created",
];

export default function EncryptionPage() {
  return (
    <section className="space-y-6">
      <article className="rounded-xl bg-white p-6 shadow-md dark:bg-slate-900">
        <h2 className="mb-6 text-xl font-semibold">Federated + Encryption Timeline</h2>
        <div className="relative ml-4 border-l-2 border-indigo-300 pl-8 dark:border-indigo-800">
          {steps.map((step, index) => (
            <div key={step} className="relative mb-6">
              <span className="absolute -left-[42px] flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 text-xs text-white">
                {index + 1}
              </span>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800">
                {step}
              </div>
            </div>
          ))}
        </div>
      </article>

      <article className="rounded-xl bg-white p-6 shadow-md dark:bg-slate-900">
        <h2 className="mb-4 text-xl font-semibold">Data Flow</h2>
        <div className="grid grid-cols-1 gap-3 text-center md:grid-cols-4 md:items-center">
          {["Local Data", "Encrypted Data", "Decrypted Data", "Global Model"].map((item, idx) => (
            <div key={item} className="flex items-center justify-center gap-2">
              <div className="w-full rounded-lg bg-slate-100 p-3 font-medium dark:bg-slate-800">{item}</div>
              {idx < 3 && <span className="hidden text-xl md:block">→</span>}
            </div>
          ))}
        </div>
      </article>

      <article className="rounded-xl bg-white p-6 shadow-md dark:bg-slate-900">
        <h2 className="mb-4 text-xl font-semibold">Notebook Output (Static)</h2>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          The structure below is extracted from your notebook's hybrid RSA + AES flow. These values are displayed
          statically here (realtime encryption is not executed in this UI).
        </p>

        <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800">
            <p className="mb-2 text-sm font-semibold text-slate-800 dark:text-slate-100">1) Local model → pickled params</p>
            <pre className="whitespace-pre-wrap break-words text-xs leading-relaxed text-slate-700 dark:text-slate-200">
{`# notebook (hybrid_encrypt)
model_bytes = pickle.dumps({
  "coef": model.coef_,
  "intercept": model.intercept_
})`}
            </pre>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800">
            <p className="mb-2 text-sm font-semibold text-slate-800 dark:text-slate-100">2) AES encrypt params</p>
            <pre className="whitespace-pre-wrap break-words text-xs leading-relaxed text-slate-700 dark:text-slate-200">
{`# notebook (hybrid_encrypt)
session_key = get_random_bytes(16)
cipher_aes = AES.new(session_key, AES.MODE_EAX)
ciphertext, tag = cipher_aes.encrypt_and_digest(model_bytes)`}
            </pre>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800 lg:col-span-2">
            <p className="mb-2 text-sm font-semibold text-slate-800 dark:text-slate-100">3) RSA encrypt AES key + Final package</p>
            <pre className="whitespace-pre-wrap break-words text-xs leading-relaxed text-slate-700 dark:text-slate-200">
{`# notebook (hybrid_encrypt)
cipher_rsa = PKCS1_OAEP.new(public_key)
enc_session_key = cipher_rsa.encrypt(session_key)

# returned structure
encrypted_package = {
  "enc_session_key": enc_session_key,
  "nonce": cipher_aes.nonce,
  "tag": tag,
  "ciphertext": ciphertext
}`}
            </pre>
          </div>
        </div>

        <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-900 dark:bg-emerald-950">
          <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-200">4) Decryption (notebook hybrid_decrypt)</p>
          <pre className="mt-2 whitespace-pre-wrap break-words text-xs leading-relaxed text-emerald-900/80 dark:text-emerald-200">
{`# notebook (hybrid_decrypt)
session_key = cipher_rsa.decrypt(encrypted_package["enc_session_key"])
cipher_aes = AES.new(session_key, AES.MODE_EAX, nonce=encrypted_package["nonce"])
model_bytes = cipher_aes.decrypt_and_verify(
  encrypted_package["ciphertext"],
  encrypted_package["tag"]
)
params = pickle.loads(model_bytes)`}
          </pre>
        </div>
      </article>

      <article className="rounded-xl bg-white p-6 shadow-md dark:bg-slate-900">
        <h2 className="mb-3 text-xl font-semibold">Notebook Prints (Static)</h2>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          These are the notebook print outputs shown as static text in the UI.
        </p>
        <pre className="mt-4 whitespace-pre-wrap break-words text-xs leading-relaxed text-slate-700 dark:text-slate-200">
{`Central Server RSA keys generated
Heart model parameters encrypted for all hospitals
Global Heart Model created using Federated Aggregation
Global Heart Model Accuracy: 0.905

Global (Per-organ) Accuracy:
Heart: 0.905
Lung: 0.927
Kidney: 0.857
Liver: 0.871
Brain: 0.902`}
        </pre>
      </article>

      <article className="rounded-xl border border-emerald-200 bg-emerald-50 p-6 shadow-md dark:border-emerald-900 dark:bg-emerald-950">
        <p className="text-lg font-semibold text-emerald-700 dark:text-emerald-300">Secure Aggregation Enabled</p>
        <p className="mt-1 text-sm text-emerald-700/90 dark:text-emerald-200">
          No raw patient data is shared between hospitals.
        </p>
      </article>
    </section>
  );
}
