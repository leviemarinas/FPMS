module.exports = (req, res) => {
    console.log(req.session);
    res.render('home/views/frontpage');
    
}