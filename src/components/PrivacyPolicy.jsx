import React from "react";

function PrivacyPolicy() {
  return (
    <div className="container-xxl py-5">
      <div className="container">
        <div className="text-center mb-5">
          <h1 className="mb-3">Privacy Policy</h1>
          <p className="text-muted">
            Your privacy is important to us. Please read our policy carefully to
            understand how we handle your information.
          </p>
        </div>

        <div className="bg-light p-4 rounded shadow-sm">
          <h4>1. Information We Collect</h4>
          <p>
            We collect personal information such as your name, email, phone
            number, and resume when you register or apply for jobs on our
            platform.
          </p>

          <h4>2. How We Use Your Information</h4>
          <p>
            The information is used to connect you with potential employers,
            improve our services, and send you relevant job updates.
          </p>

          <h4>3. Sharing of Information</h4>
          <p>
            We only share your information with employers or recruiters when you
            apply for a job. We never sell your data to third parties.
          </p>

          <h4>4. Data Security</h4>
          <p>
            We take appropriate security measures to protect your personal
            information against unauthorized access, alteration, or disclosure.
          </p>

          <h4>5. Your Rights</h4>
          <p>
            You may request access, update, or deletion of your personal
            information anytime by contacting our support team.
          </p>

          <h4>6. Updates to This Policy</h4>
          <p>
            We may update our Privacy Policy from time to time. Any changes will
            be reflected on this page with a new "last updated" date.
          </p>

          <p className="mt-4">
            If you have questions about this Privacy Policy, please{" "}
            <a href="/contact">contact us</a>.
          </p>
        </div>
      </div>
    </div>
  );
}

export default PrivacyPolicy;
