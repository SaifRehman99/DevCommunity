const deleteBTN = document.querySelector(".delete");

document.body.addEventListener("click", e => {
    if (e.target.classList.contains("delete")) {
        // getting the id here
        let id = e.target.getAttribute("data-id");

        fetch(`/stories/del/${id}`, {
                method: "DELETE"
            })
            .then(res => {
                console.log("Deleted!");
                window.location.href = "/dashboard";
            })
            .catch(err => console.log(err));
    }
});