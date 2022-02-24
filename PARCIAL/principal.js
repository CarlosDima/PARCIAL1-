var db_sistema = openDatabase('dbsistema', '1.0', 'Sistema de Facturacion', 5 * 1024 * 1024);
if(!db_sistema){
    alert('Lo siento tu navegado NO soporta BD locales.');
}
var app = new Vue({
    el: '#appCliente',
    data: {
        cliente: {
            accion: '',
            msg : '',
            idLibro: '',
            IdAutor: '',
            ISBN: '',
            Titulo: '',
            Editorial: ''
            
        },
    },
    methods: {
        guardarCliente(){
            db_sistema.transaction(tx=>{
                tx.executeSql('INSERT INTO clientes (IdLibro, IdAutor, ISBN, Titulo, Editorial) VALUES (?,?,?,?,?)',
                [this.cliente.idLibro, this.cliente.IdAutor, this.cliente.ISBN, this.cliente.Titulo, 
                    this.cliente.Editorial],
                (tx, results)=>{
                    this.cliente.msg = 'Libro guardado con exito';
                    this.nuevoCliente();
                },
                (tx, error)=>{
                    this.cliente.msg = `Error al guardar el libro ${error.message}`;
                });
            });
        },
        nuevoCliente(){
            this.cliente.accion = 'nuevo';
            this.cliente.idCliente = '';
            this.cliente.IdLibro = '';
            this.cliente.IdAutor = '';
            this.cliente.ISBN = '';
            this.cliente.Titulo = '';
            this.cliente.Editorial = '';
        }
    },
    created(){
        db_sistema.transaction(tx=>{
            tx.executeSql('CREATE TABLE IF NOT EXISTS clientes(idCliente INTEGER PRIMARY KEY AUTOINCREMENT, '+
                'codigo char(10), nombre char(75), direccion TEXT, telefono char(10), dui char(10))');
        }, err=>{
            console.log('Error al crear la tabla de Libros', err);
        });
    }
});

var db_sistema = openDatabase('dbsistema', '1.0', 'Sistema de Facturacion', 5 * 1024 * 1024);
if(!db_sistema){
    alert('Lo siento tu navegado NO soporta BD locales.');
}
var app = new Vue({
    el: '#appCliente',
    data: {
        clientes: [],
        buscar: '',
        cliente: {
            accion: 'nuevo',
            msg : '',
            idLibro: '',
            IdAutor: '',
            ISBN: '',
            Titulo: '',
            Editorial: ''
        },
    },
    methods: {
        buscarCliente(){
            if( this.buscar.trim().length>0 ){
                this.clientes = this.clientes.filter(item=>item.nombre.toLowerCase().indexOf(this.buscar.toLowerCase())>=0);
            } else {
                this.obtenerClientes();
            }
            this.obtenerClientes(this.buscar);
        },
        guardarCliente(){
            let sql = '',
                parametros = [];
            if(this.cliente.accion == 'nuevo'){
                sql = 'INSERT INTO clientes (IdLibro, IdAutor, ISBN, Titulo, Editorial) VALUES (?,?,?,?,?)';
                parametros = [this.cliente.IdLibro,this.cliente.IdAutor,this.cliente.ISBN,this.cliente.Titulo,this.cliente.Editorial];
            }else if(this.cliente.accion == 'modificar'){
                sql = 'UPDATE clientes SET codigo=?, nombre=?, direccion=?, telefono=?, dui=? WHERE idCliente=?';
                parametros = [this.cliente.IdLibro,this.cliente.IdAutor,this.cliente.ISBN,this.cliente.Titulo,this.cliente.Editorial,this.cliente.idCliente];
            }else if(this.cliente.accion == 'eliminar'){
                sql = 'DELETE FROM clientes WHERE idCliente=?';
                parametros = [this.cliente.idCliente];
            }
            db_sistema.transaction(tx=>{
                tx.executeSql(sql,
                    parametros,
                (tx, results)=>{
                    this.cliente.msg = 'Cliente procesado con exito';
                    this.nuevoCliente();
                    this.obtenerClientes();
                },
                (tx, error)=>{
                    this.cliente.msg = `Error al guardar el cliente ${error.message}`;
                });
            });
        },
        modificarCliente(cliente){
            this.cliente = cliente;
            this.cliente.accion = 'modificar';
        },
        eliminarCliente(cliente){
            if( confirm(`¿Esta seguro de eliminar el cliente ${cliente.nombre}?`) ){
                this.cliente.idCliente = cliente.idCliente;
                this.cliente.accion = 'eliminar';
                this.guardarCliente();
            }
        },
        obtenerClientes(busqueda=''){
            db_sistema.transaction(tx=>{
                tx.executeSql(`SELECT * FROM clientes WHERE nombre like "%${busqueda}%" OR codigo like "%${busqueda}%"`, [], (tx, results)=>{
                    this.clientes = results.rows;
                    this.clientes = [];
                    for(let i=0; i<results.rows.length; i++){
                        this.clientes.push(results.rows.item(i));
                    }
                });
            });
        },
        nuevoCliente(){
            this.cliente.accion = 'nuevo';
            this.cliente.idCliente = '';
            this.cliente.IdLibro = '';
            this.cliente.IdAutor = '';
            this.cliente.ISBN = '';
            this.cliente.Titulo = '';
            this.cliente.Editorial = '';
        }
    },
    created(){
        db_sistema.transaction(tx=>{
            tx.executeSql('CREATE TABLE IF NOT EXISTS clientes(idCliente INTEGER PRIMARY KEY AUTOINCREMENT, '+
                'codigo char(10), nombre char(75), direccion TEXT, telefono char(10), dui char(10))');
        }, err=>{
            console.log('Error al crear la tabla de clientes', err);
        });
        this.obtenerClientes();
    }
});