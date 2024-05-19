class API {
  private baseUrl = 'http://localhost:3001/'
  private headers = { 'Content-Type': 'application/json' }

  public users = {
    coach: {
      create: async (data: {
        name: string
        email: string
      }): Promise<{ ok: boolean; title: string; message: string; conflict?: boolean }> => {
        try {
          const res = await fetch(this.baseUrl.concat('users/coach'), {
            method: 'POST',
            headers: this.headers,
            body: JSON.stringify(data),
          })
          const response = await res.json()
          return { ok: res.ok, title: response.title, message: response.message, conflict: res.status === 409 }
        } catch {
          return {
            ok: false,
            title: 'Desculpe, parece que ocorreu um erro.',
            message: 'Tente novamente em instantes...',
          }
        }
      },
    },
  }
}

export const services = new API()
