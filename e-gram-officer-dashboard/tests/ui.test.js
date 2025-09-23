/**
 * @jest-environment jsdom
 */
import { UIController } from "../app.js";

describe("UIController Integration Tests", () => {
  let ui;

  beforeEach(() => {
    // Setup minimal HTML for testing
    document.body.innerHTML = `
      <aside>
        <button class="nav-btn" data-target="services"></button>
        <button class="nav-btn" data-target="update"></button>
        <button class="nav-btn" data-target="logout"></button>
      </aside>
      <section id="panel-services" class="panel active"></section>
      <section id="panel-update" class="panel"></section>
      <form id="statusForm">
        <input id="appId" name="appId" />
        <select id="newStatus" name="newStatus">
          <option value="">Select</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>
        <button type="submit">Submit</button>
        <div id="statusMsg"></div>
      </form>
    `;
    ui = new UIController();
  });

  test("should show services panel by default", () => {
    expect(document.querySelector("#panel-services").classList.contains("active")).toBe(true);
    expect(document.querySelector("#panel-update").classList.contains("active")).toBe(false);
  });

  test("should switch to update panel when update nav clicked", () => {
    document.querySelector('[data-target="update"]').click();
    expect(document.querySelector("#panel-update").classList.contains("active")).toBe(true);
    expect(document.querySelector("#panel-services").classList.contains("active")).toBe(false);
  });

  test("form should show error when empty", () => {
    const form = document.getElementById("statusForm");
    form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
    const msg = document.getElementById("statusMsg").textContent;
    expect(msg).toMatch(/required/);
  });

  test("form should reject non-numeric ID", () => {
    document.getElementById("appId").value = "abc";
    document.getElementById("newStatus").value = "Approved";
    const form = document.getElementById("statusForm");
    form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
    const msg = document.getElementById("statusMsg").textContent;
    expect(msg).toMatch(/numeric/);
  });

  test("form should accept valid input", () => {
    document.getElementById("appId").value = "123";
    document.getElementById("newStatus").value = "Pending";
    const form = document.getElementById("statusForm");
    form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
    const msg = document.getElementById("statusMsg").textContent;
    expect(msg).toMatch(/Application 123 updated to Pending/);
  });
});
