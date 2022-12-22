import { useState, useEffect } from 'react'
import './admin.css'
import { auth, db } from '../../firebaseconnection'
import { signOut } from 'firebase/auth'
import { 
    addDoc,
    collection,
    onSnapshot,
    query,
    orderBy,
    where,
    doc, 
    deleteDoc,
    updateDoc
} from 'firebase/firestore'
import { async } from '@firebase/util'

export default function Admin(){
    const [tarefa, setTarefa] = useState('');
    const [user, setUser] = useState({});
    const [listaTarefas, setListaTarefas] = useState([]);
    const [edit, setEdit] = useState({});

    useEffect(()=>{
        async function loadTarefas(){
            const userDetail = localStorage.getItem('@detailUser')
            setUser(JSON.parse(userDetail))

            if(userDetail){
                const data = JSON.parse(userDetail);

                const tarefaRef = collection(db, 'tarefas')
                const q = query(tarefaRef, orderBy('create', 'desc'), where('userUid', '==', data?.uid))
                const unsub = onSnapshot(q, (snapshot) =>{
                    let lista = [];
                    
                    snapshot.forEach((doc) => {
                        lista.push({
                            id: doc.id,
                            tarefa: doc.data().tarefa,
                            userUid: doc.data().userUid
                        })
                    })

                    setListaTarefas(lista);
                })
            }
        }

        loadTarefas();
    }, [])

    async function handleRegister(e){
        e.preventDefault();

        if(tarefa === ''){
            alert('Digite sua tarefa...')
            return;
        }

        if(edit?.id){
           handleUpdateTarefa();
           return; 
        }

        await addDoc(collection(db, 'tarefas'), {
            tarefa: tarefa,
            create: new Date(),
            userUid: user?.uid
        })
        .then(()=>{
            console.log('Tarefa Registrada')
            setTarefa('');
        })
        .catch((error)=>{
            console.log('Erro ' + error )
        })

    }

    async function handleSair(){
        await signOut(auth);
    }

    async function deletarTarefa(id){
        const docRef = doc(db, 'tarefas', id)
        await deleteDoc(docRef)
    }

    function editarTarefa(item){
        setTarefa(item.tarefa)
        setEdit(item);

    }

    async function handleUpdateTarefa(){
        const docRef = doc(db, 'tarefas', edit?.id)
        await updateDoc(docRef, {
            tarefa: tarefa
        })
        .then(()=>{
            console.log('tarefa atualizada')
            setTarefa('')
            setEdit({})
        })
        .catch(()=>{
            console.log('Erro ao atualizar')
            setTarefa('')
            setEdit('')
        })
    }

    return(
        <div className='admin-container'>
            <h1>Minhas tarefas</h1>

            <form className='form' onSubmit={handleRegister}>
                <textarea 
                    placeholder='Digite sua tarefa...' 
                    value={tarefa}
                    onChange={(e) => setTarefa(e.target.value)}
                />

                {Object.keys(edit).length > 0 ? (
                    <button className='btn-register' style={{ backgroundColor: '#0000FF'}} type='submit'>Atualizar tarefa</button>
                ) : (
                    <button className='btn-register' type='submit'>Adicionar tarefa</button>
                )}
            </form>

            {listaTarefas.map((item) => (
                    <article key={item.id} className='lista-tarefas'>
                        <p>{item.tarefa}</p>

                        <div>
                            <button onClick={() => editarTarefa(item)}>Editar</button>
                            <button onClick={() => deletarTarefa(item.id)} className='btn-delete'>Concluir</button>
                        </div>
                        <hr className='regua'/>
                    </article>
            ))}
            
            <button className='btn-sair' onClick={handleSair}>Sair</button>
        </div>
    )
}