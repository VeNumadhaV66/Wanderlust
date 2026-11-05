// 1) Client side form validation (Bootstrap style).
// Stops the form from submitting if any field is invalid
// and shows the red messages under the fields.
(() => {
  const forms = document.querySelectorAll(".needs-validation");

  forms.forEach((form) => {
    form.addEventListener("submit", (event) => {
      if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
      }
      form.classList.add("was-validated");
    });
  });
})();

// 2) Image preview: show the chosen file before it is uploaded
(() => {
  const MAX_SIZE = 5 * 1024 * 1024; // 5 MB, same limit as the server

  document.querySelectorAll("input[type=file][data-preview]").forEach((input) => {
    const preview = document.getElementById(input.dataset.preview);

    input.addEventListener("change", () => {
      const file = input.files[0];

      // empty message = valid, any text = invalid (shows the red message)
      input.setCustomValidity(file && file.size > MAX_SIZE ? "Image too big" : "");

      if (file && preview) {
        preview.src = URL.createObjectURL(file);
        preview.classList.remove("d-none");
      }
    });
  });
})();

// 3) "Display total after taxes" switch (adds 18% GST to the shown prices)
(() => {
  const taxSwitch = document.getElementById("taxSwitch");

  if (!taxSwitch) {
    return;
  }

  taxSwitch.addEventListener("change", () => {
    document.querySelectorAll(".listing-price").forEach((el) => {
      const price = Number(el.dataset.price);
      const shown = taxSwitch.checked ? Math.round(price * 1.18) : price;

      el.querySelector(".price-value").textContent =
        "\u20B9 " + shown.toLocaleString("en-IN");
      el.querySelector(".price-note").textContent = taxSwitch.checked
        ? "/ night, after taxes"
        : "/ night";
    });
  });
})();

// 4) Rating text: shows a word next to the stars while choosing
(() => {
  const ratingText = document.getElementById("ratingText");

  if (!ratingText) {
    return;
  }

  const words = { 1: "Terrible", 2: "Not good", 3: "Average", 4: "Very good", 5: "Amazing" };

  document.querySelectorAll('input[name="review[rating]"]').forEach((radio) => {
    radio.addEventListener("change", () => {
      ratingText.textContent = words[radio.value];
    });
  });
})();