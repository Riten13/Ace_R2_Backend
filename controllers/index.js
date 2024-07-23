// Example Controller Function
export const getName = (req, res) => {
    try {
        //Add your controller specific code here
        return res.status(200).send("John Doe")
    } catch (err) {
        console.log(err)
        return res.status(500).send("Something went wrong!")
    }
}