


async function payNow() {

    const amount = Number(document.getElementById("amount").value);

    if (!amount || amount <= 0) {
        alert("Enter valid amount");
        return;
    }

    const response = await fetch("/create-order", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            amount: amount
        })
    });

    const order = await response.json();

    console.log(order);

    const options = {
        key: "<%= key %>",
        order_id: order.id,
        name: "Tarun Dandapathak",
        description: "Test Transaction",

        handler: async function (response) {

            const verify = await fetch("/verify-payment", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_signature: response.razorpay_signature
                })
            });

            const data = await verify.json();

            if (data.status === "ok") {
                window.location.href = "/payment-success";
            } else {
                alert("Payment verification failed");
            }
        },

        theme: {
            color: "#F37254"
        }
    };

    const rzp = new Razorpay(options);
    rzp.open();

}

