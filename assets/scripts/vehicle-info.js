// Gallery Image zoom in modal
var modal = document.getElementById('myModal');
var span = document.getElementsByClassName("close")[0];
var modalImg = document.getElementById("img01");

// close with X
span.onclick = function () {
  modal.style.display = "none";
};

// close when clicking outside the image (backdrop)
modal.onclick = function (e) {
  // if you clicked the backdrop (or anything that's not the image), close
  if (e.target !== modalImg) {
    modal.style.display = "none";
  }
};

// open on image click
var images = document.getElementsByTagName('img');
for (var i = 0; i < images.length; i++) {
  images[i].onclick = function () {
    modal.style.display = "block";
    modalImg.src = this.src;
    modalImg.alt = this.alt;
  };
}
